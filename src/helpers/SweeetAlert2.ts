import Swal from "sweetalert2";

export default class Sweet {
  static success(message: string): void {
    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: message,
    });
  }
  static error(message: string): void {
    Swal.fire({
      icon: "error",
      title: "Gagal",
      text: message,
    });
  }
  static warning(message: string): void {
    Swal.fire({
      icon: "warning",
      title: "Peringatan",
      text: message,
    });
  }
  static info(message: string): void {
    Swal.fire({
      icon: "info",
      title: "Informasi",
      text: message,
    });
  }

  static confirm(message: string, callback?: any): void {
    Swal.fire({
      title: "Apakah kamu yakin?",
      icon: "question",
      text: message,
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Tidak",
      customClass: {
        confirmButton: "btn btn-sm btn-primary fs-16",
        cancelButton: "btn btn-sm btn-danger fs-16",
        popup: "swal2-popup swal2-show",
        title: "swal2-title",
        icon: "text-primary border border-primary",
      },
      // Removed invalid properties
    }).then((result: any) => {
      if (result.isConfirmed) {
        callback();
      }
    });
  }
}