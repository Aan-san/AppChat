const http       = require("http")
const Socket      = require("websocket").server
const server      = http.createServer(()=>{})

// start server and log for check
server.listen(3000, ()=>{
    console.log("server started on port 3000")
})

//array to save user id
const userList = []

// check user exist func
const FindUser = username =>{
    for(let i =0;i<userList.length;i++){
        if(userList[i].name === username){
            return userList[i]
        }
    }
}

const websocket = new Socket({httpServer : server})

websocket.on('request',(req)=>{
    const connection = req.accept()
    console.log(connection)

    // get data
    connection.on('message',(message)=>{        
        const data = JSON.parse(message.utf8Data)

        // checking when send request string
        console.log(data)

        // create user
        const user = FindUser(data.name)

        // Process data req 
        switch(data.type){
            // User 
            case "store_user":
                if(user != null){
                    // check if exist
                    connection.send(JSON.stringify(({
                        type:"user already exist"
                    })))

                    return
                }

                // if not then create new
                const newUser = {
                    name: data.name ,connect : connection
                }

                // add to list user
                userList.push(newUser)
            break

            // call        
            case "start_call":
                let userToCall = FindUser(data.target)
                if(userToCall){
                    // check if user online then send msg
                    connection.send(JSON.stringify(({
                        type:"call",
                        data:"user ready to call"
                    })))
                }
                else{
                    // check if user offline then send msg
                    connection.send(JSON.stringify(({
                        type:"call",
                        data:"user is offline"
                    })))
                }
            break

            // user send a offer to call
            case "create_offer":
                // check user exist
                let userReceiveOffer = FindUser(data.target)
                if(userReceiveOffer){
                    // if exist then send msg by user
                    userReceiveOffer.connection.send(JSON.stringify(({
                        type: "offer_received",
                        name: data.name,
                        data: data.data.sdp,
                    })))
                }
            break

            // user send a awswer when offered
            case "create_anwser":
                // check user exist
                let userReceiveAnswer = FindUser(data.target)
                if(userReceiveAnswer){
                    // if exist then send msg by user
                    userReceiveAnswer.connection.send(JSON.stringify(({
                        type: "offer_received",
                        name: data.name,
                        data: data.data.sdp,
                    })))
                }
            break

            // receive a call
            case "ice_candidate":
                // check user exist
                let userIceCandidate = FindUser(data.target)
                if(userIceCandidate){
                    // if exist then send msg by user
                    userIceCandidate.connection.send(JSON.stringify(({
                        type: "ice_candidate",
                        name: data.name,
                        data: {
                            sdpMLineIndex:  data.data.sdpMLineIndex,
                            sdpMid:         data.data.sdpMid,
                            sdpCandidate:   data.data.sdpCandidate
                        },
                    })))
                }
            break
        }
    })

    connection.on('close',()=>{
        // check user connection
        userList.forEach(user =>{
            if(user.connect === connection){
                userList.splice(userList.indexOf(user),1)
            }
        })
    })
})