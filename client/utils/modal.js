export class Modal {
  static show(title, message, callback) {
    $('#modalTitle').html(title);
    $('#modalMessage').html(message);

    const onClick = () => {
      $('#btn-confirm-modal').off('click', onClick);
      $('#mainModal').modal('hide');
      setTimeout(() => {
        callback();
      }, 300);
    }

    $('#btn-confirm-modal').on('click', onClick);

    $('#mainModal').modal({
      show: true,
      keyboard: true,
      backdrop: true,
    });
  }
}
