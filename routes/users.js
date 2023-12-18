const express =require("express");

const {users}=require("../data/users.json");

const router= express.Router();

/**
 * Route: /users
 * Method: GET
 * Desciption: Get all users
 * Access: Public
 * Paramters: None
 */

router.get("/",(req,res)=>{
    res.status(200).json({
        success: true,
        data: users
    })
})

/**
 * Route: /users/:id
 * Method: GET
 * Desciption: Get single user by id
 * Access: Public
 * Paramters: id
 */
router.get("/:id",(req,res)=>{
    const {id}=req.params;
    const user=users.find((each)=>each.id===id);
        if(!user){
            res.status(404).json({
                success: false ,
                message:"user not found with the particular id "
            })
        }
        res.status(200).json({
            success:true,
            data :user
        })
    
})

/**
 * Route: /users
 * Method: POST
 * Desciption: Create a new user
 * Access: Public
 * Paramters: None
 */

router.post("/",(req,res)=>{
    const {id,name,surname,email,subscriptionType, subscriptionDate}=req.body;
    const user=users.find((each)=>each.id===id);
    if(user){
        res.status(404).json({
            success:false,
            message : "user already exist with the given id .please enter a unique id "
        })
    }
    users.push({
        id,
        name,
        surname,
        email,
        subscriptionType,
        subscriptionDate
    });
    res.status(200).json({
        success:true,
        data : users
    })
})

/**
 * Route: /users/:id
 * Method: PUT
 * Desciption: Updating a user by id
 * Access: Public
 * Paramters: ID
 */

router.put("/:id",(req,res)=>{
    const {id}=req.params;
    const {data}=req.body;
    const user=users.find((each)=>each.id===id);
    if(!user){
        res.status(404).json({
            success:false,
            message : "user not found  "
        })
    }
    const updatedUser = users.map((each)=>{
        if(each.id===id){
            return {
                ...each,
                ...data
            };
        }
        return each
    })
    res.status(200).json({
        success:true,
        message:"user details updated sucessfully ",
        data:updatedUser
    })
})

/**
 * Route: /users/:id
 * Method: DELETE
 * Desciption: Deleting a user by id
 * Access: Public
 * Paramters: ID
 */

router.delete("/:id",(req,res)=>{
    const {id} = req.params;

    const user = users.find((each)=> each.id === id);
    if(!user){
        return res.status(404).json({
            success: false,
            message: "User Not Found"
        })
    }
    const index = users.indexOf(user);
    users.splice(index, 1);

    return res.status(200).json({
        success: true,
        data: users
    })
})

module.exports=router;