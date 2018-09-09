// Bbilerplate handling CSRF setup for ajax posts
// Taken XXX from since it's 
// Move into shared setup file if this grows bigger
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

const get_panel = ($panel_button) => {
    // Gets the panel jquery object from the button
    return $panel_button.parent().parent()
}

const update_focus = (id, first_name, last_name, datetime, description) => {
    // Updates the focus board with new information
    // @args
    //   id (string): Patient ID

    $id = $("#focus-patient-id")
    $first_name = $("#focus-first-name")
    $last_name = $("#focus-last-name")
    $datetime = $("#focus-datetime")
    $description = $("#focus-description")
    console.log(id)
    $id.text(id)
    $first_name.text(first_name)
    $last_name.text(last_name)
    $datetime.text(datetime)
    $description.text(description)
}

const activate_panel = ($panel) => {
    //  Activates a panel, placing it on the main display and pinging the
    //  visitor display to come in.1
    let id = $panel.attr("id")
    let first_name = $panel.find(".panel-first-name").text()
    let last_name = $panel.find(".panel-last-name").text()
    let datetime = $panel.find(".panel-datetime").text()
    let description = $panel.find(".panel-text").text()
    update_focus(id, first_name, last_name, datetime, description)
    $panel.remove()
}

const add_panel = (id, first_name, last_name, datetime, description) => {
    // Adds a panel to the waitlist
    $("#visitor-panel-list").append(
        `<div class="card visitor-panel container" id=${id}>
            <div class="row">
              <div class="col-10">
                <div class="row">
                  <div class="col-7">
                    <h5 class="card-title m-1 float-left panel-first-name">${first_name}</h5> 
                    <h5 class="card-title m-1 float-left panel-last-name">${last_name}</h5>
                  </div>
                  <div class="col-5">
                    <h6 class="mt-2 text-muted float-right panel-datetime">${datetime}</h6>
                  </div>
                </div>
                <div class="ml-2" id="description-block">
                  <h6>Description</h5>
                  <div class="panel-text p-1 m-0">
                    ${description}
                  </div>  
                </div>
              </div>
              <!-- right side containing a clicky button-->
              <div class="col-2 center-block text-center panel-button">
                <div class="send-next align-center">
                  <p>See Next</p>
                  <p class="fas fa-caret-right panel-glyph"></p>  
                </div>
              </div>
            </div>
          </div>
        `)
}

// Test helper functions
const demo = () => {
    let patient_data = [[2, "Bob", "Smith", "Today", "Sick"],
                        [3, "Sally", "Smith", "Today", "Sick"],
                        [4, "Tim", "Smith", "Today", "Sick"],
                        [5, "Lu", "Smith", "Today", "Sick"],
                        [6, "Hope", "Smith", "Today", "Sick"],
                        [7, "Alice", "Smith", "Today", "Sick"],
                        [8, "Sarah", "Smith", "Today", "Sick"],
                        [9, "Bobby", "Smith", "Today", "Sick"]]
    for (let i = 0; i < patient_data.length; i++){
        add_panel(...patient_data[i])
    }
}

const get_and_insert_visitor = (visitor_id) => {
    // Variable to store the visitor_details in on success
    var visitor_details
    let data_string = "id=" + visitor_id
    // Ajax is async, deal with it in the callback
    $.ajax({type:"POST",
            url: doctor_url,
            data: data_string,
            success: function(data){
              data = JSON.parse(data)
              let visitor_data = data["visitor_data"]
              add_panel(visitor_data["id"],
                        visitor_data["first_name"],
                        visitor_data["last_name"],
                        visitor_data["datetime_string"],
                        visitor_data["description"])
              $("#visitor-panel-list").sortable();
            },
            error: function(e){console.error("Unable to acquire information for visitor " + visitor_id)}
    })
}

const acknowledge_visitor = (visitor_id) => {
    // Acknowleges the visitor server side, marking them as seen
    let data_string = "id=" + visitor_id
    $.ajax({type:"POST",
            url: acknowledge_patient_url,
            data: data_string,
            success: function(data){console.log(`Visitor ${visitor_id} has been acknowledged`)},
            error: function(e){console.error("Unable to acknowledge visitor " + visitor_id)}
    })
}


// All things websocket

// Initializes the websocket handler for the visitor view
var listen_ws_url = "ws://" + window.location.host + "/ws/pingdoktor/doctor/";

const initialize_socket = () => {
    let socket = new WebSocket(listen_ws_url)
    socket.onopen = () => {console.log("OPENED")}
    if (socket.readyState == WebSocket.OPEN) {
      socket.onopen()
    }

    socket.onmessage = (e) => {
        let data = JSON.parse(e.data)
        let type = data["type"]
        // Update the visitor (Doctor calling a new one to enger)
        // Vistor data already exists, only need ID
        if (type == "doctor"){
            get_and_insert_visitor(data["id"])
        }
        else {console.log(`Ignored message with type ${data["type"]}`)}
    }
    socket.onclose = (e) => {
      console.error("Socket closed unexpectedly");
    }
    return socket
}

const socket_signal = (socket, visitor_id) => {
    // Signals the visitor board telling it to update
    resp =  socket.send(JSON.stringify({
        "type": "visitor",
        "message": {"task": "visitor_update", 
                    "id": visitor_id,
                    "type": "visitor",
                    "task": "update"}
    }))
}

var socket = initialize_socket()


// Document initialization
$(document).ready(function(){
    $("#visitor-panel-list").sortable();
    $("#visitor-panel-list").disableSelection();
    $("#visitor-panel-list").on("click", ".panel-button", function(){
        let $panel = get_panel($(this))
        let visitor_id = $panel.attr("id")
        socket_signal(socket, visitor_id)
        acknowledge_visitor(visitor_id)
        activate_panel($panel)

    })
})