var express = require("express");
var router = express.Router();

const {mongodb, dbName, dbUrl, MongoClient} = require("../dbconfig");

const client = new MongoClient(dbUrl);
// let mentors = [];
// let students = [];

/* Create mentor  */

router.post("/mentors", async (req, res) => {
	const client = new MongoClient(dbUrl);
	client.connect();
	try {
		let db = await client.db(dbName);
		let dblength = await db.collection("mentors").find().toArray();
		dblength = dblength.length;
		let data = await db.collection("mentors").insertOne({
			_id: dblength + 1,
			name: req.body.name,
			skills: req.body.skills,
			students: req.body.students,
		});
		res.send({
			message: "Data created Successfully",
			data,
		});
	} catch (error) {
		console.log(error);
		res.send({message: "Internal server error", error});
	} finally {
		client.close();
	}

	// let data = {
	// 	id: mentors.length + 1,
	// 	name: req.body.name,
	// 	skills: req.body.skills,
	// 	students: req.body.students,
	// };
	// mentors.push(data);
	// res.json({
	// 	statusCode: 200,
	// 	message: "Mentor created successfully",
	// });
});

router.get("/getmentors", async (req, res) => {
	const client = new MongoClient(dbUrl);
	client.connect();
	try {
		let db = await client.db(dbName);
		let data = await db.collection("mentors").find().toArray();
		res.send({
			message: "Data Recevied Successfully",
			data,
		});
	} catch (error) {
		console.log(error);
		res.send({message: "Internal server error", error});
	} finally {
		client.close();
	}
});

/* Create students  */

router.post("/students", async (req, res) => {
	const client = new MongoClient(dbUrl);
	client.connect();
	try {
		let db = await client.db(dbName);
		let dblength = await db.collection("students").find().toArray();
		dblength = dblength.length;
		let namelowercase = req.body.name;
		namelowercase = namelowercase.toLowerCase();
		let data = await db.collection("students").insertOne({
			_id: dblength + 1,
			name: namelowercase,
			course: req.body.course,
			mentorid: req.body.mentorid,
		});
		res.send({
			message: "Data created Successfully",
			data,
		});
	} catch (error) {
		console.log(error);
		res.send({message: "Internal server error", error});
	} finally {
		client.close();
	}
});

router.get("/getstudents", async (req, res) => {
	const client = new MongoClient(dbUrl);
	client.connect();
	try {
		let db = await client.db(dbName);
		let data = await db.collection("students").find().toArray();
		res.send({
			message: "Data Recevied Successfully",
			data,
		});
	} catch (error) {
		console.log(error);
		res.send({message: "Internal server error", error});
	} finally {
		client.close();
	}
});

/* Select one mentor and add multiple student */

router.put("/mentor/:id/studentassigntomentor", async (req, res) => {
	const client = new MongoClient(dbUrl);
	client.connect();
	try {
		let db = await client.db(dbName);
		let changedata = parseInt(req.params.id);
		let data = await db.collection("mentors").updateOne({_id: changedata}, {$set: {students: req.body.students}});

		let filterstudentsname = await db.collection("students").find().toArray();
		const lowerArr = req.body.students.map(item => item.toLowerCase());

		let assignedstudents = filterstudentsname.filter(student => {
			if (lowerArr.includes(student.name)) {
				return student;
			}
		});

		res.send({
			message: "Data created Successfully",
			data,
			assignedstudents,
			changedata,
		});
	} catch (error) {
		console.log(error);
		res.send({message: "Internal server error", error});
	} finally {
		client.close();
	}
});

/*delete a particular student from mentor*/
router.delete("/:id/:stdfrommentor", async (req, res) => {
	const client = new MongoClient(dbUrl);
	client.connect();
	try {
		let mentorid = parseInt(req.params.id);
		let deletestd = req.params.stdfrommentor;
		deletestd = deletestd.toLowerCase();
		const db = await client.db(dbName);
		let deletedstudent = await db.collection("mentors").updateOne({_id: mentorid}, {$pull: {students: deletestd}});
		res.send(deletedstudent);
	} catch (error) {
		console.log(error);
		res.send({message: "Internal server error", error});
	} finally {
		client.close();
	}
});

/*Select one student and assign one mentor*/

router.put("/stdassign/:name", (req, res) => {
	const client = new MongoClient(dbUrl);
	client.connect();
	let studentname = req.params.name;
	studentname = studentname.toLowerCase();
	try {
		const db = client.db(dbName);

		let data = db.collection("students").updateOne({name: studentname}, {$set: {mentorid: req.body.mentorid}});
		res.send(data);
	} catch (error) {
		console.log(error);
		res.send({message: "Internal server error", error});
	} finally {
		client.close();
	}
});

/*Create API to show all student and assign one mentor*/

router
	.route("/liststd/:mentorid")
	.get(async (req, res) => {
		const client = new MongoClient(dbUrl);
		client.connect();
		try {
			let db = await client.db(dbName);
			let data = await db.collection("students").find().toArray();
			res.send({
				message: "Data Recevied Successfully",
				data,
			});
		} catch (error) {
			console.log(error);
			res.send({message: "Internal server error", error});
		} finally {
			client.close();
		}
	})
	.post(async (req, res) => {
		const client = new MongoClient(dbUrl);
		client.connect();
		try {
			let mentorid = parseInt(req.params.mentorid);
			let db = await client.db(dbName);
			let data = await db.collection("students").updateMany({mentorid: {$exists: true}}, {$set: {mentorid: mentorid}});
			res.send({
				message: "Data Recevied Successfully",
				data,
			});
		} catch (error) {
			console.log(error);
			res.send({message: "Internal server error", error});
		} finally {
			client.close();
		}
	});

module.exports = router;
