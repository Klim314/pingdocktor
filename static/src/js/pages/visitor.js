// Handle CSRF setup for ajax posts
// Taken XXX from since it's boilerplate
$.ajaxSetup({ 
     beforeSend: function(xhr, settings) {
         function getCookie(name) {
             var cookieValue = null;
             if (document.cookie && document.cookie != '') {
                 var cookies = document.cookie.split(';');
                 for (var i = 0; i < cookies.length; i++) {
                     var cookie = jQuery.trim(cookies[i]);
                     // Does this cookie string begin with the name we want?
                     if (cookie.substring(0, name.length + 1) == (name + '=')) {
                         cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                         break;
                     }
                 }
             }
             return cookieValue;
         }
         if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
             // Only send the token to relative URLs i.e. locally.
             xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
         }
     } 
});


const add_visitor = (visitor_data) => {
  // Appends a visitor to the current visitor list
  // visitor data must contain id, first_name and last_name variables

  let id = visitor_data.id
  let first_name = visitor_data.first_name
  let last_name = visitor_data.last_name
  // Append the visitor to the current list
  $("#visitor_list").append(`<li class="list-group-item col-xs-6 visitor_entry" id="${id}">${first_name} ${last_name}</li>`)
}


const remove_visitor = (visitor_id) => {
  // Visitors only removed on activation
  $(`.visitor_entry#${visitor_id}`).remove()
}


const activate_visitor = (visitor_id) => {
  // Activates a visitor, removing it from the waitlist and moving it to the upper menu
  let $current_visitor_header = $("#current_patient")

  let $target_visitor = $(`#${visitor_id}`)
  // If the function is being double-called, return
  if ($target_visitor.length == 0){return 0}
  let visitor_name = $target_visitor.text()
  
  $current_visitor_header.text(visitor_name)
  // Fade in and out
  emphasize_header()
  $(`.visitor_entry#${visitor_id}`)
  remove_visitor(visitor_id)
} 


const emphasize_header = () => {
  // Flickers the header and plays a sound to notify patients that it's their turn
  $("#current_patient").fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200);
}


// All things websocket
var listen_ws_url = "ws://" + window.location.host + "/ws/pingdoktor/visitor/";

const initialize_socket = () => {
  // Initializes the websocket handler for the visitor view
  let socket = new WebSocket(listen_ws_url)
  socket.onopen = () => {console.log("OPENED")}
  if (socket.readyState == WebSocket.OPEN) {
      socket.onopen()
    }

  socket.onmessage = (e) => {
    let data = JSON.parse(e.data)
    let task = data["task"]
    // Update the visitor (Doctor calling a new one to enger)
    console.log(data)
    // Vistor data already exists, only need ID
    if (task == "update"){
      activate_visitor(data["id"])
    }
    // Re-emphasize visitor (Doctor calling the same visitor) (unimplemented)
    else if (task == "trigger"){
      emphasize_header()
    }
    else {console.log(`Ignored message with task ${data["task"]}`)}
  }
  socket.onclose = (e) => {
      console.error("Socket closed unexpectedly");
  }
  return socket
}


var socket = initialize_socket()


$(document).ready(function(){
  // Registration form bindings
  $(".registration-form").submit(function(event){
    event.preventDefault()
    $(".error").hide()
    //  Get the form fields
    let first_name = $("input#first_name")
    let last_name = $("input#last_name")
    let description = $("textarea#description")
    let required_fields = [first_name,
                           last_name,
                           description]
    let flag = 0
    // Validate the form
    for (var i = 0; i < required_fields.length; i++){
      field = required_fields[i]
      if (!field.val()){
        // Toggle the error
        field.parent().children(".error").show()
        flag = 1
      }
    }
    // Return early if validation flag was procced
    if (flag){return false}

    // Yank out the values and submit to the actual service
    [first_name, last_name, description] = [first_name.val(), last_name.val(), description.val()]

    let data = "first_name=" + first_name + "&last_name=" + last_name + "&description=" + description
    $.ajax({type:"POST",
            url: visitor_url,
            data: data,
            success: function(data){
              data = JSON.parse(data)
              visitor_data = data["visitor_data"]
              console.log([visitor_data])
              // Append the visitor to the current waitlist
              add_visitor(visitor_data)
              // Docter alert handled in view
              // Clear the form for the next user
              required_fields.forEach(function(x){x.val("")})
            }
    })
    return false
  })
})