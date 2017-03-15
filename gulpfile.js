var gulp 			= require('gulp'),
		ts	 			= require('gulp-typescript'),
		tsProj 		= ts.createProject('tsconfig.json');

gulp.task('compile', function(){
	return tsProj.src()
 		.pipe(tsProj())
   	.js
		.pipe(gulp.dest('./build'));
});