export default {
	LabelColor:'#008695',
	IconColor:'#48BF91',
	resetForm: (tabWidgets) => {
		tabWidgets.forEach(eachWidget => {resetWidget(eachWidget)});
	},
		disableSalesAdminButton:  () => {
			console.log('Visibility')
		return ( false ||  CA_Select.data.find((row)=>{return row.name == appsmith.user.username.split('@')[0]})?.name == appsmith.user.username.split('@')[0])
	},
	checkSalesAdminAccess: async () => {
		let roles = `'${PageObjects.roles_with_access.join(',')}'`
		const result = await AccessCheck_Select.run({'userName': appsmith.user.username.split('@')[0], 'roles': roles});
		storeValue('showSalesAdmin', result[0].Count === 0? false: true, false)
		return result
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
	
	disableDeleteButton: (formTable) => {
		// Function accepts a table object and
		// function returns false, if any of the form widgets returns false during validity check. 
	  let disableDelete = formTable.selectedRowIndex === -1?true:false;
	  return disableDelete;
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

	async insertSalesRow(){ 
		if(await GlobalVariables.uniqueCheck("Sales", "Number", Sales_Number_Input.text)===false) {
			showAlert("Sales# not unique", "error");
		} else {
			await Sales_Insert.run();
			Sales_Select.run({"currentStateName": appsmith.store.currentStateName});
			GlobalVariables.resetForm(["Sales_Details_Container", "Sales_Table"]); 
		} 
	},
	
		filterTableData: () => {
		// Filter the tables based on user selection from a drop down. 
		let ClientFilter = "1=1";
		let SalesManagerFilter = "1=1";

		if(Client_MultiSelect.selectedOptionValues.length > 0) {
			
			ClientFilter = "Sales.ClientId in ("+Client_MultiSelect.selectedOptionValues.toLocaleString()+")";
				
			}
   if(SalesManager_MultiSelect.selectedOptionValues.length > 0) {
			
			SalesManagerFilter = "Sales.SalesManagerId in ("+SalesManager_MultiSelect.selectedOptionValues.toLocaleString()+")";
		 }

		Sales_Select.run({"ClientFilter": ClientFilter, "SalesManagerFilter": SalesManagerFilter});
			
	},
	 
	filterDropDownsData: () => {
		let ClientDropDown = "1=1";
		let SalesManagerDropDown = "1=1";

		if(Client_MultiSelect.selectedOptionValues.length > 0) {
			
			SalesManagerDropDown = "Sales.ClientId in ("+Client_MultiSelect.selectedOptionValues.toLocaleString()+")";

			} else if(SalesManager_MultiSelect.selectedOptionValues.length > 0) {
			
			ClientDropDown = "Sales.SalesManagerId in ("+SalesManager_MultiSelect.selectedOptionValues.toLocaleString()+")";
	
	  }
		SalesManagerFilter_Select.run({"Client": SalesManagerDropDown})
		console.log(SalesManagerDropDown)
		ClientFilter_select.run({"SalesManager": ClientDropDown});
		console.log(ClientDropDown)
	},
	
}