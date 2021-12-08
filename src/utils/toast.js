import Toastify from 'toastify-js'

const toast = ({status, title, content}) => {
  var toastContent = null
  if(status === 'success') toastContent = cash('#success-notification-content').clone().removeClass("hidden")[0]
  else toastContent = cash('#error-notification-content').clone().removeClass("hidden")[0]
  
  cash(toastContent).find('.notification-title').text(title)
  cash(toastContent).find('.notification-content').text(content)

  // return
  Toastify({
    node: toastContent,
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: 'top',
    position: 'right',
    stopOnFocus: true
  }).showToast()
}

export default toast