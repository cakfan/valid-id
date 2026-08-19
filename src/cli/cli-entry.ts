import { validateNik } from "../nik/validate-nik";
import { validateNpwp } from "../npwp/validate-npwp";
import { validateNib } from "../nib/validate-nib";

const COLORS = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
} as const;

function printNikResult(result: ReturnType<typeof validateNik>) {
  if (!result.valid) {
    console.log(`${COLORS.red}X${COLORS.reset} ${COLORS.bold}NIK tidak valid${COLORS.reset}`);
    console.log(`  ${COLORS.dim}${result.reason}${COLORS.reset}`);
    return;
  }

  const d = result.data!;
  console.log(`${COLORS.green}\u2713${COLORS.reset} ${COLORS.bold}NIK valid${COLORS.reset}`);
  console.log(`  ${COLORS.cyan}Provinsi${COLORS.reset}    : ${d.region.provinceName} (${d.region.provinceCode})`);
  console.log(`  ${COLORS.cyan}Kab/Kota${COLORS.reset}    : ${d.region.regencyName} (${d.region.regencyCode})`);
  console.log(`  ${COLORS.cyan}Kecamatan${COLORS.reset}   : ${d.region.districtName} (${d.region.districtCode})`);
  console.log(`  ${COLORS.cyan}Tgl Lahir${COLORS.reset}   : ${String(d.birthDate.day).padStart(2, "0")}-${String(d.birthDate.month).padStart(2, "0")}-${d.birthDate.year}`);
  console.log(`  ${COLORS.cyan}Gender${COLORS.reset}      : ${d.birthDate.gender === "male" ? "Laki-laki" : "Perempuan"}`);
}

function printNpwpResult(result: ReturnType<typeof validateNpwp>) {
  if (!result.valid) {
    console.log(`${COLORS.red}X${COLORS.reset} ${COLORS.bold}NPWP tidak valid${COLORS.reset}`);
    console.log(`  ${COLORS.dim}${result.reason}${COLORS.reset}`);
    return;
  }

  const formatLabel: Record<string, string> = {
    old_15: "Format lama (15 digit)",
    new_16: "Format baru (16 digit)",
    new_nik: "Berbasis NIK (16 digit)",
  };

  console.log(`${COLORS.green}\u2713${COLORS.reset} ${COLORS.bold}NPWP valid${COLORS.reset}`);
  console.log(`  ${COLORS.cyan}Format${COLORS.reset}      : ${formatLabel[result.format] ?? result.format}`);

  if (result.data) {
    console.log(`  ${COLORS.cyan}Jenis WP${COLORS.reset}   : ${result.data.taxpayerType}`);
    console.log(`  ${COLORS.cyan}KPP${COLORS.reset}        : ${result.data.kppCode}`);
    console.log(`  ${COLORS.cyan}Cabang${COLORS.reset}     : ${result.data.branchCode}`);
  }
}

function printNibResult(result: ReturnType<typeof validateNib>) {
  if (!result.valid) {
    console.log(`${COLORS.red}X${COLORS.reset} ${COLORS.bold}NIB tidak valid${COLORS.reset}`);
    console.log(`  ${COLORS.dim}${result.reason}${COLORS.reset}`);
    return;
  }

  console.log(`${COLORS.green}\u2713${COLORS.reset} ${COLORS.bold}NIB valid${COLORS.reset}`);
  console.log(`  ${COLORS.dim}Format 13 digit — tidak ada verifikasi checksum publik${COLORS.reset}`);
}

function printUsage() {
  console.log(`${COLORS.bold}valid-id${COLORS.reset} — Validasi nomor identitas Indonesia\n`);
  console.log(`${COLORS.bold}Usage:${COLORS.reset}`);
  console.log(`  valid-id nik  <nomor>   Validasi NIK (Nomor Induk Kependudukan)`);
  console.log(`  valid-id npwp <nomor>   Validasi NPWP (Nomor Pokok Wajib Pajak)`);
  console.log(`  valid-id nib  <nomor>   Validasi NIB (Nomor Induk Berusaha)`);
}

const args = process.argv.slice(2);
const command = args[0]?.toLowerCase();
const value = args[1];

if (!command || !value) {
  printUsage();
  process.exit(1);
}

switch (command) {
  case "nik":
    printNikResult(validateNik(value));
    break;
  case "npwp":
    printNpwpResult(validateNpwp(value));
    break;
  case "nib":
    printNibResult(validateNib(value));
    break;
  default:
    console.error(`${COLORS.red}Unknown command: ${command}${COLORS.reset}`);
    printUsage();
    process.exit(1);
}
