const Question = require('../models/question_schema.js');

const router_index = (req,res) => {
    res.redirect(301,'/');
};

const router_add = (req,res) => {
    res.render('questions/add.ejs', { title: 'Add Question' });
};

const router_post = (req,res) => {
    console.log("this is post");
    req.body.topic = req.body.topic.toLowerCase();

    const question = new Question(req.body);

    question.save()
    .then((result) => res.redirect('/'))
    .catch((error) => console.log(error));
};

const show_topic_questions = async (req,res) => {
    console.log(`Entered ${req.params.topic}`);
    let count = 0;
    try {
        count = await Question.countDocuments({topic : req.params.topic});
        // console.log("Total Number of Documents:", count);
    } catch (error) {
        console.error(error);
    }

    Question.find({topic: req.params.topic})
    .then((result) =>  {
        if(result){
            res.render('questions/single_topic_questions.ejs', { title: req.params.topic, count:count, questions: result }) 
        }else{
            res.render('404.ejs', {title : '404 error' });
        }
    })
    .catch((error) => console.log(error));
};

const question_update_page = (req,res) => {
    console.log("This is topic/id/update");
    const id = req.params.id;
    
    Question.findById(id)
    .then((result) => {
        if(result){
            res.render('questions/update_form.ejs', { title: 'details', question: result})
        }else{
            res.render('404.ejs', {title:'404 error'})
        }
    })
    .catch((error) => {
        console.log(error)
        res.render('404.ejs', {title:'404 error'});
    });
};

const question_details = (req,res) => {
    console.log("This is get topic/id");
    Question.findById(req.params.id)
    .then((result) => {
        if(result){
            res.render('questions/details.ejs', { title: 'details', question: result})
        }else{
            res.render('404.ejs', {title:'404 error'})
        }
    })
    .catch((error) => {
        console.log(error)
        res.render('404.ejs', {title:'404 error'});
    });
};

const question_delete = (req,res) => {
    console.log("This is delete topic/id/topic");

    const topic = req.params.topic;
    const id = req.params.id;

    Question.findByIdAndDelete(id)
    .then((result) => {
        if(result){
            res.json({redirect : `/questions/${topic}`});
        }
    })
    .catch((error) => {
        res.render('404.ejs', {title : '404 error'});
        console.log(error);
    });
};

const question_update = (req, res) => {
    console.log("This is put topic/id/topic");
    req.body.topic = req.body.topic.toLowerCase();
    
    const id = req.params.id;
    console.log(req.body);
    Question.findByIdAndUpdate(id, req.body, { new: true })
        .then((updated) => {
            if (updated) {
                res.json({ redirect: `/questions/${updated.topic}/${updated._id}` });
            } else {
                res.status(404).json({ error: 'Question not found' });
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error: 'Server error' });
        });
};

module.exports = {
    router_index,
    router_add,
    router_post,
    show_topic_questions,
    question_update_page,
    question_details,
    question_delete,
    question_update
}