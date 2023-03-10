var express = require("express");
var router = express.Router();

let mentors = [];
let students = [];

/* Create mentor  */

router.post("/mentors", (req, res) => {
	let data = {
		id: mentors.length + 1,
		name: req.body.name,
		skills: req.body.skills,
		students: req.body.students,
	};
	mentors.push(data);
	res.json({
		statusCode: 200,
		message: "Mentor created successfully",
	});
});

/* Create students  */

router.post("/students", (req, res) => {
	let data = {
		name: req.body.name,
		course: req.body.course,
		mentorid: req.body.mentorid,
	};
	students.push(data);
	res.json({
		statusCode: 200,
		message: "Student created successfully",
	});
});

/* Select one mentor and add multiple student */

router.put("/mentor/:id/studentassigntomentor", (req, res) => {
	mentors[req.params.id].students = req.body.students;

	let assignedstudents = students.filter(student => student.mentorid == null);

	let response = {assignedstudents, mentors, students};

	res.json(response);
});

/*delete a particular student from mentor*/
router.delete("/:id/stdfrommentor", (req, res) => {
	mentors[req.params.id].students.foreach(data, index => {
		if (data.tolowercase() === req.body.student.tolowercase()) {
			mentors.students.slice(index, 1);
		}
	});
	res.json({
		statusCode: 201,
		message: "student deleted successfully",
	});
});

/*Select one student and assign one mentor*/

router.put("stdassign/:name", (req, res) => {
	students.foreach((data, index) => {
		if (data.name.tolowercase() === req.params.name.toLowerCase()) {
			students[index].mentor = req.body.mentorid;
		}
	});
	res.json({
		statusCode: 200,
		message: "Mentor assigned to student",
	});
});

/*Create API to show all student and assign one mentor*/

router
	.route("/liststd/:mentorid")
	.get((req, res) => {
		res.send(students);
	})
	.post((req, res) => {
		students.forEach(data => {
			data.mentor = req.body.mentorid;
		});
		res.json({
			statusCode: 200,
			message: `${mentors[req.body.mentorid].name} is assigned to all students`,
		});
	});

module.exports = router;
