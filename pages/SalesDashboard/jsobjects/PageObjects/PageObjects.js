export default {
	accessControl:async()=>{
		await UserRoles_Select.run()
		let role = '';
		if (UserRoles_Select.data.find((row) => row.Name === 'Sales Manager' || row.Name === 'Accounts Receivables')) {
			console.log('111')
			role = 'SalesManager'
		}else if (UserRoles_Select.data.find((row) => row.Name === 'Business Manager')) {
			console.log('222')
			role = 'BusinessManager';
		}
		await storeValue('FilterRole', role, false);
    console.log('frole', appsmith.store.FilterRole);
    await Sales_Select.run();
	},
}