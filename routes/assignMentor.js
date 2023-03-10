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

router.get("/getmentors", (req, res) => {
	res.json(mentors);
});

/* Create students  */

router.post("/students", (req, res) => {
	let data = {
		name: req.body.name,
		course: req.body.course,
		mentorid: req.body.mentorid,
	};

	for (let key in data) {
		if (typeof data[key] === "string") {
			data[key] = data[key].toLowerCase();
		}
	}
	students.push(data);
	res.json({
		statusCode: 200,
		message: "Student created successfully",
	});
});

router.get("/getstudents", (req, res) => {
	res.json(students);
});

/* Select one mentor and add multiple student */

router.put("/mentor/:id/studentassigntomentor", (req, res) => {
	mentors[req.params.id].students = req.body.students;
	const lowerArr = req.body.students.map(item => item.toLowerCase());
	let assignedstudents = students.filter(student => {
		if (lowerArr.includes(student.name)) {
			return student;
		}
	});

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

router.put("/stdassign/:name", (req, res) => {
	const name = req.params.name;
	const reqmentorid = req.body.mentorid;

	for (let i = 0; i < students.length; i++) {
		if (reqmentorid <= mentors.length && students[i].name === name.toLowerCase()) {
			students[i].mentorid = reqmentorid;
		}
	}

	res.json({
		name,
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
		for (let i = 0; i < students.length; i++) {
			students[i].mentorid = parseInt(req.params.mentorid);
		}

		res.json({
			statusCode: 200,
			message: `${mentors[req.params.mentorid].name} is assigned to all students`,
		});
	});

module.exports = router;
