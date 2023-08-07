# Donny Kon's Note
This is a standard Angular project written in VSCode.
Since the solution was made wothout a backend solution, this is purely a Frontend project.
Running this project should merely involve cloning the code and running it.
To debug, I recommend starting from app.components.ts, which bears the bulk of the implementation.

# Project Requirements
The website must have the following features:
● Show the existing clients.
    Successful. 
    By default, an empty search returns the full list.
● Add and remove a client.
    Not implemented. 
    As a beginner angular project for me, I decided the mapping feature took presidence.
    Due to the learning curve, I ran out of time.
● Filter the clients (e.g. all the clients with the surname “Cohen”).
    Successful. 
    Although no filter required. 
● Input fields should be validated (at least at minimum level) - both on frontend and backend.
    Not implemented.
    Since I didn't need a backend, and I didn't implement an add feature yet.

Extras:
● For each client IP, show some geo information about the IP address. You can use any API you find
online. For example - https://ip-api.com/
    Successful. 
    Used Open Street Map in the end.
● Usage of a database. You can use SQL, NoSQL, anything you feel comfortable with.
    Successful. 
    Uploaded a mini Sqlite database to DBHub.io. 
    This allowed me to avoid adding a backend.
● Responsiveness for different screen sizes (tablets, mobile phones etc).
    Successful. 
    Design of the frontend had this in mind.

# GeoIP

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
