const express =require("express");

const {books}=require("../data/books.json");
const {users}=require("../data/users.json");

const router= express.Router();


/**
 * Route: /books 
 * Method: GET
 * Desciption: Get all books 
 * Access: Public
 * Paramters: None
 */


router.get("/",(req,res)=>{
    res.status(200).json({
        success: true,
        data : books
    })
})


/**
 * Route: /books/:id
 * Method: GET
 * Desciption: Get book by its ID
 * Access: Public
 * Paramters: Id
 */


router.get("/:id",(req,res)=>{
    const {id}=req.params;
     const book=books.find((each)=>each.id===id)
     if(!book){
        res.status(404).json({
            success : false,
            message :"the book with the particular is does not exist "
        })
     }
     res.status(200).json({
        success:true,
        data : book
     })
})

/**
 * Route: /books/issued
 * Method: GET
 * Desciption: Get all issued books
 * Access: Public
 * Paramters: None
 */


router.get("/issued/books", (req, res)=>{
    const usersWithIssuedBooks = users.filter((each)=>{
        if(each.issuedBook) return each;
    })

    const issuedBooks = [];

    usersWithIssuedBooks.forEach((each)=>{
        const book = books.find((book)=> book.id ===each.issuedBook);

        book.issuedBy = each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;

        issuedBooks.push(book)
    })
    if(issuedBooks.length===0)
    return res.status(404).json({
success: false,
message: "No issued books yet"
})

return res.status(200).json({
    success: true,
    data: issuedBooks
})
})


/**
 * Route: /books
 * Method: POST
 * Desciption: Create a New Book
 * Access: Public
 * Paramters: None
 */

router.post("/", (req, res)=>{
    const {data} = req.body;

    if(!data){
        return res.status(400).json({
            success: false,
            message: "No data provided"
        })
    }
    const book = books.find((each)=> each.id ===data.id)

    if(book){
        return res.status(404).json({
            success: false,
            message: "Book with given id already exists"
        })
    }
    const allBooks = [...books, data]

    return res.status(201).json({
        success: true,
        data: allBooks
    })
})


/**
 * Route: /books/:id
 * Method: PUT
 * Desciption: Update a book
 * Access: Public
 * Paramters: Id
 */


router.put("/:id",(req,res)=>{
    const {id}=req.params;
    const {data}=req.body;
    if(!data){
        return res.status(404).json({
            success:false,
            message:"enter the data to update"
        })
    }
    const book=books.find((each)=>each.id===id);
    if(!book){
        return res.status(500).json({
            success:false,
            message:"there is no book with the particular id"
        })
    }
    const updatedbooks=books.map((each)=>{
        if(each.id===id){
            return {...each,...data};
        }
        return each;
    })

    return res.status(200).json({
        success:true,
        data : updatedbooks
    })

})

/**
 * Route: /books/fine/:id
 * Method: GET
 * Desciption: get the fine of a user 
 * Access: Public
 * Paramters: id
 */

router.get("/fine/:id",(req,res)=>{
    const {id}=req.params;

    const user=users.find((each)=>each.id===id);

    if(!user){
        return res.status(404).json({
            success:false,
            message:"user does not exist"
        })
    }
    const getdateindays=(data="")=>{
        let date;

        if(date===""){
            date=new Date();
        }
        else {
            data=new Date(data);
        }
        let days=Math.floor(data/1000*60*60*24);
        return days;
    };


    const subscriptiontype=(date)=>{
        if(users.subscriptionType=="Basic"){
            date=date+90
        }else if(users.subscriptionType=="Standard"){
            date=date+180
        }else if(users.subscriptionType=="Premium"){
            date=date+365
        }
        return date;
    }

    let returnDate=getdateindays(users.returnDate);
    let currentDate=getdateindays();
    let subscriptiondate=getdateindays(users.subscriptionDate);
    let subscriptionexpirydate=subscriptiontype(subscriptiondate);

    const data={
        ...users,
        subscriptionexpired: subscriptionexpirydate<currentDate,
        daysleftforexpiration:
        subscriptionexpirydate<=currentDate? 0 : subscriptionexpirydate-currentdate,
        fine:
        returndate<currentdate ? subscriptionexpirydate<=currentdate ? 200:100:0,
    }
    return res.status(202).json({
        success:true,
        data:updatedata
    })

})












module.exports=router;