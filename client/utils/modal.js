let lastCallback;

export class Modal {
  static show(title, message, callback) {
    $('#modalTitle').html(title);
    $('#modalMessage').html(message);

    lastCallback = callback;

    const onClick = () => {
      $('#btn-confirm-modal').off('click', onClick);
      $('#mainModal').modal('hide');

      if (lastCallback) {
        const callbackToCall = lastCallback;
        lastCallback = false;
        setTimeout(() => {
          callbackToCall();
        }, 300);
      }
    }

    $('#btn-confirm-modal').on('click', onClick);

    $('#mainModal').modal({
      show: true,
      keyboard: true,
      backdrop: true,
    });
  }
}
