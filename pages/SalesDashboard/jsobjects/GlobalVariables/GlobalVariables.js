export default {
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
	// filterDropDownsData: () => {
		// let ClientDropDown = "1=1";
		// let SalesManagerDropDown = "1=1";
// 
		// if(Client_MultiSelect.selectedOptionValues.length > 0) {
			// 
			// SalesManagerDropDown = "Sales.ClientId in ("+Client_MultiSelect.selectedOptionValues.toLocaleString()+")";
// 
			// } else if(SalesManager_MultiSelect.selectedOptionValues.length > 0) {
			// 
			// ClientDropDown = "Sales.SalesManagerId in ("+SalesManager_MultiSelect.selectedOptionValues.toLocaleString()+")";
	// 
	  // }
		// SalesManagerFilter_Select.run({"Client": SalesManagerDropDown})
		// console.log(SalesManagerDropDown)
		// ClientFilter_select.run({"SalesManager":ClientDropDown});
		// console.log(ClientDropDown)
		// console.log(ClientFilter_select.data)
	// },
		filterDropDownsDataClient: () => {
		let ClientDropDown = "1=1";
	//	let SalesManagerDropDown = "1=1";

	 if(SalesManager_MultiSelect.selectedOptionValues.length > 0) {
			
			ClientDropDown = "Sales.SalesManagerId in ("+SalesManager_MultiSelect.selectedOptionValues.toLocaleString()+")";
	
	  }
		ClientFilter_select.run({"SalesManager":ClientDropDown});
		console.log(ClientDropDown)
		console.log(ClientFilter_select.data)
	},
		filterDropDownsDataSales: () => {
		//let ClientDropDown = "1=1";
		let SalesManagerDropDown = "1=1";

		if(Client_MultiSelect.selectedOptionValues.length > 0) {
			
			SalesManagerDropDown = "Sales.ClientId in ("+Client_MultiSelect.selectedOptionValues.toLocaleString()+")";

			} 
	
		SalesManagerFilter_Select.run({"Client": SalesManagerDropDown})
		console.log(SalesManagerDropDown)

	},
	
		resetForm: (tabWidgets) => {
		tabWidgets.forEach(eachWidget => {resetWidget(eachWidget)});
	},

	resetWidgets: (widgetsArray) => {
		const widgetMap = widgetsArray.map((aWdiget) => resetWidget(aWdiget));
		return Promise.all(widgetMap);
	},
}