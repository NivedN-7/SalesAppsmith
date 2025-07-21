export default {
	getInitialState:async () => {
		if (appsmith.store.currentStateName) {
			return appsmith.store.currentStateName;
		} else {
			storeValue("currentStateName", 'Lead');
			return "Lead";
		}

	},
	isCorrectState:(state) => {return(appsmith.store.stateName==state.Name);},
	getState:(stateName)=>{ return(MongoDBObjects.salesStates.find((state) => {return(state.Name == stateName)}))},
	getDecision:(decisionName)=>{return(appsmith.store.currentState.Next.find((thisDecision)=>{return(thisDecision.Name==decisionName)}))},
	getNextState: (decisionName) => {
		let nextStateName;
		for(let state of appsmith.store.currentNext) {
			if (Process.getState(decisionName))
				nextStateName = state.state;
			break;
		}
		return nextStateName;
	},
	async clickState(stateName, clientFilter, salesmanagerFilter , query=null)
	{
		await storeValue("currentState", Process.getState(stateName));
		await storeValue("currentStateName", stateName);
		if(query !== null ) {
			query.run({"currentStateName": stateName});
			clientFilter.run({"currentStateName": stateName});
			salesmanagerFilter.run({"currentStateName": stateName});
			showAlert("Loading Sales in state " + appsmith.store.currentStateName, "success");
		}
	},
	async clickArrow(DecisionName)
	{
		await storeValue("currentDecisionName", DecisionName);
		await storeValue("currentDecision",Process.getDecision(DecisionName));
		await storeValue("currentNext",appsmith.store.currentState.Next);
		showModal("ChangeState_Modal");
	},
	disableArrow:(arrow)=>{return((appsmith.store.currentStateName!=arrow) || (Sales_Table.selectedRowIndex === -1));},
	stateButtonVariant:(stateName)=>{return(appsmith.store.currentStateName==stateName?"PRIMARY":"SECONDARY");},
	getModalTitle: ()=>{ return(appsmith.store.currentDecision?.Title||"") },
	getModalConfrimation: ()=>{return (appsmith.store.currentDecision.Confirmation.map((thisValue)=>{return({"label":thisValue,"value":thisValue})}))},
	async onModalSubmitClicked() {
		await showAlert("Moving Sale to " + appsmith.store.currentDecision.State + " State");
		Sales_State_Update.run({"nextState": appsmith.store.currentDecision.State, "salesId": Sales_Table.selectedRow.SalesId});
		SalesHistory_Insert.run({"nextState": appsmith.store.currentDecision.State, "salesId": Sales_Table.selectedRow.SalesId});
		Process.postModalSubmit(appsmith.store.currentDecision.Name);                                                                          
		await Sales_Select.run({"currentStateName": appsmith.store.currentStateName});
		closeModal("ChangeState_Modal");
	},
	onNewSalesAddition: ()=> {
		Sales_Insert.run().catch("Creating new sales failed! ")
			.then((response) => Sales_Select.run({"currentStateName": appsmith.store.currentStateName})
						.then((response) => SalesHistory_Insert.run({"currentStateName": appsmith.store.currentStateName}).catch("Updating Sales History failed!", "error")));
		GlobalVariables.resetForm(["Sales_Details_Container", "Sales_Table"]);
	},

	async onTabSelected(tabName, salesId) { 
		let tabQueryMap = {"Competition": [Competition_Select]};

		let tableToLoad = {
			"History": SalesHistory_Select,
			"Notes": SalesNotes_Select,
			"Competition": SalesCompetition_Select,
			"Decision Reason": SalesDecision_Select
		};

		await storeValue("currentSalesId", salesId)

		showAlert("Success, Selected " + tabName, "success"); 

		if (salesId !== -1 && tabName in tableToLoad) {
			tableToLoad[tabName].run({"salesId": salesId})
				.finally((response)=> showAlert("Table Query Executed", "success"));
		}

		if (tabName in tabQueryMap) { 
			tabQueryMap[tabName].forEach(eachQuery => {
				eachQuery.run()
					.then((response) => showAlert("Tab allowed", "success"), (error)=> {showAlert("failed!")})
			});
		}
	},

	postModalSubmit: (currentDecision) => {
		// Encodes the queries to execute when a sale is moved between states. 
		let decisionQueryMap = {
			"Evaluation_Signoff": [ Estimate_Insert ],
		};

		if (currentDecision in decisionQueryMap) { 
			decisionQueryMap[currentDecision].forEach(eachQuery => {
				eachQuery.run({"salesId":Sales_Table.selectedRow.SalesId})
					.then((response) => showAlert("Query Executed after submit.", "success"))
			});
		}

	},

	getCurrentState: (defaultState) => {
		return appsmith.store?.currentStateName? Process.getState(appsmith.store?.currentStateName): Process.getState(defaultState);
	}
}