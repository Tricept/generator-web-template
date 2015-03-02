var path = require('path'),
    gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    watch = require('gulp-watch'),
    connect = require('gulp-connect'),<% if(cssPreprocessor == 'LESS') { %>
    less = require('gulp-less'),<% } %><% if(cssPreprocessor == 'SASS') { %>
    sass = require('gulp-sass'),<% } %>
    cssmin = require('gulp-cssmin');

function processStyles() {<% if(cssPreprocessor == 'LESS') { %>
    gulp.src('./template/styles/**/*.less')<% } %><% if(cssPreprocessor == 'SASS') { %>
    gulp.src('./template/styles/**/*.scss')<% } %>
    .pipe(plumber())
    <% if(cssPreprocessor == 'LESS') { %>.pipe(less({
        'paths': [path.join(__dirname, 'bower_components')]
    }))<% } %><% if(cssPreprocessor == 'SASS') { %>.pipe(sass({
        'includePaths': 'bower_components/'
    }))<% } %>
    .pipe(cssmin())
    .pipe(gulp.dest('.tmp/styles/'));
}

gulp.task('webserver', function() {
    connect.server({
        'host': '0.0.0.0',
        'root': ['template', '.tmp'],
        'livereload': true
    });
})

gulp.task('livereload', function() {
    var files = [
        'template/**/*.html',
        '.tmp/styles/**/*.css'
    ];
    watch(files).pipe(connect.reload());
});

gulp.task('styles', processStyles);

gulp.task('watch', function() {
    watch('template/styles/**/*', processStyles);
});

gulp.task('default', ['styles', 'webserver', 'livereload', 'watch']);
