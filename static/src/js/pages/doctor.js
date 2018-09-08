const get_panel = ($panel_button) => {
	// Gets the panel jquery object from the button
	return $panel_button.parent().parent()
}

const update_focus = (id, first_name, last_name, datetime, description) => {
	// Updates the focus board with new information
	// @args
	// 	 id (string): Patient ID

	$id = $("#focus-patient_id")
	$first_name = $("#focus-first-name")
	$last_name = $("#focus-last-name")
	$datetime = $("#focus-datetime")
	$description = $("#focus-description")

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

const signal_websocket = () => {}

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


// Document initialization

$(document).ready(function(){
	$("#visitor-panel-list").on("click", ".panel-button", function(){
		let $panel = get_panel($(this))
		// let panel_id = $panel.attr("id")
		activate_panel($panel)
	})
})