export function getErrorMessage(code: string): string {
  switch (code) {
    case "EMPTY_INPUT":
      return "Input tidak boleh kosong";
    case "TIMEOUT":
      return "Server lama merespon (timeout)";
    case "BAD_RESPONSE":
      return "Server memberikan respon tidak valid";
    case "INVALID_PAYLOAD":
      return "Format data dari server aneh";
    case "SERVICE_ERROR":
      return "Service translate sedang bermasalah";
    default:
      return "Terjadi kesalahan tidak dikenal";
  }
}
