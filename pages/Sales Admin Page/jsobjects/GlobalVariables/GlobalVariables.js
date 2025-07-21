export default {
	
	LabelColor:'#33838f',
	IconColor:'#48BF91',
	
	resetForm: (tabWidgets) => {
		tabWidgets.forEach(eachWidget => {resetWidget(eachWidget)});
	},
	validateWidget: (widgetObject) => {
	// if(typeof widgetObject.text !== "undefined" && (widgetObject.isValid === true|| widgetObject.isValid === undefined)) {
		let valid = false;
		if (widgetObject.isValid === true) {
			valid = true;
		} else {
			valid = false;
		}
		return valid;
	},
	
	validateForm: (formWidgets) => {
		// function accepts an array of widget objects. see ProjectType tab for example usage. 
		// function returns false, if any of the form widgets returns false during validity check. 
		let validity = true;
		for(let aWidget of formWidgets) {
			validity = validity && (GlobalVariables.validateWidget(aWidget));
			if (validity === false)
				break;
		}
		return validity;
	},
	
	disableCreateButton: (formWidgets) => {
		// Accepts an array of widget objects. Performs validity check on each one of them. 
		// Function returns true, if validity is false, otherwise true
		return (GlobalVariables.validateForm(formWidgets) === false);
	}, 
	
	disableUpdateButton: (formWidgets, formTable) => {
		// Accepts an array of widget objects and a table widget object, If no row in the table is selected returns true. 
		// If one row is selected and all widgets pass vality check, returns false. . 
		// Function returns true, if validity is false, otherwise true 
		let disableWidget = false;
		if (formTable.selectedRowIndex === -1) {
			disableWidget = true;
		} else if (GlobalVariables.validateForm(formWidgets) === false) {
			disableWidget = true;
		} else {
			disableWidget = false;
		}
		return disableWidget;
	},
	
	//function for checking uniqueness of inserting values
	async uniqueCheck(tableName, columnName, columnValue) { 
    let unique = false;
    const response = await Duplicate_Check_Select.run({'tableName': tableName, 'columnName': columnName,'columnValue': columnValue});
    unique = (response[0].row_count === 0);
    return unique;    
  },
	//function for disable delete button
	//function returns false if we select any row from table
	disableDeleteButton: (formTable) => {
	  let disableDelete = false;
	  if (formTable.selectedRowIndex === -1) {
		  disableDelete = true;
	  } else {
		  disableDelete = false;
	  }
	  return disableDelete;
 },	
	
}