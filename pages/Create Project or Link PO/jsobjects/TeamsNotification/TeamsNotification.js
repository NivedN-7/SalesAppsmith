export default {
GroupMessage:async()=>{
		let group;
		if(appsmith.URL.hostname=="erp-dev.anoralabs.com") {		
			group = '19:f1f93ab30713465995ddcb4489388d71@thread.v2';
		} else {
			group = '19:a15961944b464dfd98f4d2b92414ad68@thread.v2';
		}
		await Message_Send.run({'onetoone':false,'group':group,'message': `<div>
		<p><strong>PO Uploaded     : </strong>Create Project-LinkPO(Sales)</p>
		<p>PO Uploaded and linked with Project ${Project_Select_Table.selectedRow.Name}. You can now download the PO</p>
		<p><strong>Project Manager :</strong> ${Project_Select_Table.selectedRow.PM}</p>
		<p><strong>Sales Order Number :</strong> ${ApproverMail_Select.data[0].SNumber}
		<p><Strong>Estimate Number :</strong> ${ApproverMail_Select.data[0].ENumber}
    
	<div>`})	
	}
}