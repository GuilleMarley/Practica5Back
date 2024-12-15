import { Collection, ObjectId } from "mongodb";
import { Student, StudentModel, Teacher, TeacherModel, Course, CourseModel } from "./types.ts";
import { formModelToCourse, formModelToStudent, formModelToTeacher } from "./utils.ts";

export const resolvers = {
  Query: {
    students: async (
        _: unknown,
        __: unknown,
        context: { StudentCollection: Collection<StudentModel> },
      ): Promise<Student[]> => {
        const studentsModel = await context.StudentCollection.find().toArray();
        return studentsModel.map((student) =>
          formModelToStudent(student)
        );
      },
      student: async (
        _: unknown,
        { id }: { id: string },
        context: {
          StudentModel: Collection<StudentModel>;
        },
      ): Promise<Student | null> => {
        const studentModel = await context.StudentModel.findOne({
          _id: new ObjectId(id),
        });
        if (!studentModel) {
          return null;
        }
        return formModelToStudent(studentModel);
      },
        teachers: async (
            _: unknown,
            __: unknown,
            context: { TeacherCollection: Collection<TeacherModel> },
        ): Promise<Teacher[]> => {
            const teachersModel = await context.TeacherCollection.find().toArray();
            return teachersModel.map((teacher) =>
            formModelToTeacher(teacher)
            );
        },
        teacher: async (
            _: unknown,
            { id }: { id: string },
            context: {
            TeacherModel: Collection<TeacherModel>;
            },
        ): Promise<Teacher | null> => {
            const teacherModel = await context.TeacherModel.findOne({
            _id: new ObjectId(id),
            });
            if (!teacherModel) {
            return null;
            }
            return formModelToTeacher(teacherModel);
        },
        courses: async (
            _: unknown,
            __: unknown,
            context: { CourseCollection: Collection<CourseModel> },
        ): Promise<Course[]> => {
            const coursesModel = await context.CourseCollection.find().toArray();
            return coursesModel.map((course) =>
            formModelToCourse(course)
            );
        },
        course: async (
            _: unknown,
            { id }: { id: string },
            context: {
            CourseModel: Collection<CourseModel>;
            },
        ): Promise<Course | null> => {
            const courseModel = await context.CourseModel.findOne({
            _id: new ObjectId(id),
            });
            if (!courseModel) {
            return null;
            }
            return formModelToCourse(courseModel);
        },

  },
  Mutation: {
    createStudent: async (_: unknown, args: { name: string; email: string }, context: { StudentCollection: Collection<StudentModel> }
    ): Promise<Student> => {
        const { name, email } = args;
        const { insertedId } = await context.StudentCollection.insertOne( { name, email, enrolledCourses: [] });
        const studentModel = {_id : insertedId, name, email, enrolledCourses: []};
        return formModelToStudent(studentModel!);
    },
    createTeacher: async (_: unknown, args: { name: string; email: string }, context: { TeacherCollection: Collection<TeacherModel> }
    ): Promise<Teacher> => {
        const { name, email } = args;
        const { insertedId } = await context.TeacherCollection.insertOne( { name, email, coursesTaught: [] });
        const teacherModel = {_id : insertedId, name, email, coursesTaught: []};
        return formModelToTeacher(teacherModel!);
    },
    createCourse: async (_: unknown, args: { title: string; description: string; teacherId: string }, context: { CourseCollection: Collection<CourseModel> }
    ): Promise<Course> => {
        const { title, description, teacherId } = args;
        const { insertedId } = await context.CourseCollection.insertOne( { title, description, teacherId, studentIds: [] });
        const courseModel = {_id : insertedId, title, description, teacherId, studentIds: []};
        return formModelToCourse(courseModel!);
    },
    deleteStudent: async (_: unknown, args: { id: string }, context: { StudentCollection: Collection<StudentModel> }
    ): Promise<boolean> => {
        const { id } = args;
        const deletedCount = await context.StudentCollection.findOneAndDelete({ _id: new ObjectId(id) });
        if (!deletedCount) {
            return false;
        }
        return true;
    },
    deleteTeacher: async (_: unknown, args: { id: string }, context: { TeacherCollection: Collection<TeacherModel> }
    ): Promise<boolean> => {
        const { id } = args;
        const deletedCount = await context.TeacherCollection.findOneAndDelete({ _id: new ObjectId(id) });
        if (!deletedCount) {
            return false;
        }
        return true;
    },
    deleteCourse: async (_: unknown, args: { id: string }, context: { CourseCollection: Collection<CourseModel> }
    ): Promise<boolean> => {
        const { id } = args;
        const deletedCount = await context.CourseCollection.findOneAndDelete({ _id: new ObjectId(id) });
        if (!deletedCount) {
            return false;
        }
        return true;
    },
    updateStudent: async (_: unknown, args: { id: string; name: string; email: string }, context: { StudentCollection: Collection<StudentModel> }
    ): Promise<Student> => {
        const { id, name, email } = args;
        const student = await context.StudentCollection.findOne({ _id: new ObjectId(id) });
        if (!student) {
            throw new Error('No encontrado');
        }
        const updatedName:string = name ?? student.name;
        const updatedEmail:string = email ?? student.email;
        const studentModel = await context.StudentCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { name: updatedName, email: updatedEmail } }
        );
        console.log(studentModel);
        return formModelToStudent(studentModel!);
    },
    updateTeacher: async (_: unknown, args: { id: string; name?: string; email?: string }, context: { TeacherCollection: Collection<TeacherModel> }
    ): Promise<Teacher> => {
        const { id, name, email } = args;
        const teacher = await context.TeacherCollection.findOne({ _id: new ObjectId(id) });
        if (!teacher) {
            throw new Error('No encontrado');
        }
        const updatedName:string = name ?? teacher.name;
        const updatedEmail:string = email ?? teacher.email;
        const teacherModel = await context.TeacherCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { name: updatedName, email: updatedEmail } }
        );
        return formModelToTeacher(teacherModel!);
    },
    updateCourse: async (_: unknown, args: { id: string; title?: string; description?: string; teacherId?: string }, context: { CourseCollection: Collection<CourseModel> }
    ): Promise<Course> => {
        const { id, title, description, teacherId } = args;
        const course = await context.CourseCollection.findOne({ _id: new ObjectId(id) });
        if (!course) {
            throw new Error('No encontrado');
        }
        const updatedTitle:string = title ?? course.title;
        const updatedDescription:string = description ?? course.description;
        const updatedTeacherId:string = teacherId ?? course.teacherId;
        const courseModel = await context.CourseCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { title: updatedTitle, description: updatedDescription, teacherId: updatedTeacherId } }
        );
        return formModelToCourse(courseModel!);
    },
    enrollStudentInCourse: async (_: unknown, args: { studentId: string; courseId: string }, context: { CourseCollection: Collection<CourseModel> }
    ): Promise<Course> => {
        const { studentId, courseId } = args;
        const course = await context.CourseCollection.findOne({ _id: new ObjectId(courseId) });
        if (!course) {
            throw new Error('No encontrado');
        }
        const studentIds = course.studentIds;
        studentIds.push(studentId);
        const courseModel = await context.CourseCollection.findOneAndUpdate(
            { _id: new ObjectId(courseId) },
            { $set: { studentIds: studentIds } }
        );
        return formModelToCourse(courseModel!);
    },
    removeStudentFromCourse: async (_: unknown, args: { studentId: string; courseId: string }, context: { CourseCollection: Collection<CourseModel> }
    ): Promise<Course> => {
        const { studentId, courseId } = args;
        const course = await context.CourseCollection.findOne({ _id: new ObjectId(courseId) });
        if (!course) {
            throw new Error('No encontrado');
        }
        const studentIds = course.studentIds;
        const index = studentIds.indexOf(studentId);
        if (index > -1) {
            studentIds.splice(index, 1);
        }
        const courseModel = await context.CourseCollection.findOneAndUpdate(
            { _id: new ObjectId(courseId) },
            { $set: { studentIds: studentIds } }
        );
        return formModelToCourse(courseModel!);
    },
}
}