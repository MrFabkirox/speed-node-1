const express = require('express');
const app = express();

const morgan = require('morgan');
app.use(morgan('common'));

const Joi = require('joi');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// app.use(express.json());

const courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' }
];

app.get('/', (req, res) => {
  res.json([
    { msg: 'index' }
  ]);
});

app.get('/api/courses', (req, res) => {

  // get all the course
  res.send(courses);

});

app.get('/api/courses/:id', (req, res) => {

  // 1.get the course id
  const course = courses.find(
    c => c.id === parseInt(req.params.id)
  );

  // 2. if not existing return 404
  if(!course) res.status(404).send('Course not found');

  // 3. display
  res.send( course );

});

app.post('/api/courses', (req, res) => {

  /* // 1. validate without destructing
    const result = validateCourse(req.body) /*/

  //*/ 1. validate w object destructuring feature in modern js
  const { error } = validateCourse(req.body); //*/

  /*/ 2. if invalid return 400 bad request without destructing
    if (result.error) {
        res.status(400).send(result.error.details[0].message)
        return
    } /*/

  //*/ 2. if invalid return 400 bad request w destructuring
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  } //*/

  /* // short validation without Joi
    if (!req.body.subject || req.body.subject.length < 3) {
        res.status(400).send('Subject less than 3 char')
        return
    } */

  // 3. update courses
  const course = {
    id : courses.length + 1,
    name : req.body.name
  };
  courses.push(course);

  // 4. display result
  res.send(course);

});

app.put('/api/courses/:id', (req, res) => {

  // 1. get the course id
  const course = courses.find(
    c => c.id === parseInt(req.params.id)
  );

  // 2. if not existing return 404
  if(!course) {
    res.status(404).send('Course not found');
    return;
  }

  // 3. validate w object destructuring feature in modern js
  const { error } = validateCourse(req.body);

  // 4. if invalid return 400 bad request with destructing
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // 5. update the course
  course.name = req.body.name;

  // 6. return updated course
  res.send(course);

});

// validate, generic function
function validateCourse(course) {

  const schema = {
    name: Joi.string().min(3).required()
  };
  const validationResult = Joi.validate(course, schema);

  console.log(validationResult);
  return validationResult;

}

app.delete('/api/courses/:id', (req, res) => {

  // 1. get the course id
  const course = courses.find(
    c => c.id === parseInt(req.params.id)
  );

  // 2. if not existing return 404
  if(!course) {
    res.status(404).send('Course not found');
    return;
  }

  // 3. update courses
  courses.splice(course);

  // 4. display result
  res.send(course);

});

// Reaching here, no route has matched the request
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// Sending the error, from the 404 or any other source
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
