export default {
	LabelColor:'#008695',
	IconColor:'#48BF91',
	resetForm: (tabWidgets) => {
		tabWidgets.forEach(eachWidget => {resetWidget(eachWidget)});
	},
	
	resetWidgets: (widgetsArray) => {
		const widgetMap = widgetsArray.map((aWdiget) => resetWidget(aWdiget));
		return Promise.all(widgetMap);
	},
	
	defaultDropDownValue: {"label": "", "value": ""},
	
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
	
	disableDeleteButton: (formTable) => {
		// Function accepts a table object and
		// function returns false, if any of the form widgets returns false during validity check. 
	  let disableDelete = formTable.selectedRowIndex === -1?true:false;
		let deleteInactive = Project_Select_Table.selectedRow.State==="Inactive"?true:false;
	  return (disableDelete ||deleteInactive);
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
	
	filterTableData: () => {
		// Filter the tables based on user selection from a drop down. 
		//let buFilter = "1=1";
		let clientFilter = "1=1";
		/*if(BU_MultiSelect.selectedOptionValues.length > 0) {
			buFilter = "Sales.BusinessUnitId in ("+BU_MultiSelect.selectedOptionValues.toLocaleString()+")";
		}*/
		if(Client_MultiSelect.selectedOptionValues.length > 0) {
			clientFilter = "Project.ClientId in ("+Client_MultiSelect.selectedOptionValues.toLocaleString()+")";
		}
		Project_Select.run({"clientFilter": clientFilter});
	},
	
	async uniqueCheck(tableName, columnName,columnValue) {
		// Generic function to check if a value in a column is used before. 
		// The value is unique if the row count is zero, otherwise there is already an entry in database with same value. 
		// Async function needs to be used inside an async function. 
		let unique = false;
		const response = await Duplicate_Value_Select.run({'tableName': tableName, 'columnName': columnName,'columnValue': columnValue});
		unique = (response[0].row_count === 0);
		// await showAlert("unique: " + unique); // for debug
		return unique;		    
	}, 
	
	checkUnique: async (filter,tableName, columnName, columnValue) => {
		return Duplicate_Check.run({'filter':filter,'tableName': tableName, 'columnName': columnName,'columnValue': columnValue})
			.then((response) => {
				return new Promise((resolve, reject) => { 
					if(response[0].row_count === 0) {
						resolve(true);
					} else {
						reject(false);
					}
				});
		});
	}
}