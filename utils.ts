import { Student, StudentModel, Teacher, TeacherModel, Course, CourseModel } from "./types.ts";

export const formModelToStudent = (studentModel: StudentModel): Student => {
  return {
    id: studentModel._id!.toString(),
    name: studentModel.name,
    email: studentModel.email,
    enrolledCourses: studentModel.enrolledCourses,
  };
};

export const formModelToTeacher = (teacherModel: TeacherModel): Teacher => {
    return {
      id: teacherModel._id!.toString(),
      name: teacherModel.name,
      email: teacherModel.email,
      coursesTaught: teacherModel.coursesTaught,
    };
  };

export const formModelToCourse = (courseModel: CourseModel): Course => {
    return {
      id: courseModel._id!.toString(),
      title: courseModel.title,
      description: courseModel.description,
      teacherId: courseModel.teacherId,
      studentIds: courseModel.studentIds,
    };
  };
  