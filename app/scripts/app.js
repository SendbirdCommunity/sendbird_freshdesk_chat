let client;

setTimeout(() => init(), 400)

//From here two locations are intialized.
//The right side menu in a ticket.
//The global CTI menu.
//The ticket details need to be sent to the CTI menu.
async function init() {
  client = await app.initialized();
}

// const sendTicketDataToCTIModal = async (data)=> {
//
//     data.origin = "sendbird_sidebar"
//     const instances = await client.instance.get()
//     sidebarInstance = instances.filter(instance => instance.location == 'cti_global_sidebar')[0]
//     client.instance.send({ message: data, receiver: [sidebarInstance.instance_id]});
// }
//
// const collectDataToPassToCTIView = async () => {
//
//     const agentData = await  client.data.get('loggedInUser');
//     const ticketCreatorData = await client.data.get('contact');
//
//     return {agentData, ticketCreatorData, sendbirdUser}
// }
