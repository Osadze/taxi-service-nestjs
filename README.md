Taxi Service Backend Microservices API

This project is a backend API for a taxi service, built with a microservices architecture using NestJS and Kafka. The main goal is to provide a scalable and real-time backend for managing taxi services, including user authentication, ride bookings, and driver management. The system handles multiple services, communicating via Kafka, and supports real-time updates through WebSockets.
What the Project Does

The API is designed to power a taxi service application where users (riders) can log in, book rides, and where drivers can accept or decline these ride requests. The whole system is based on microservices, focusing on scalability and real-time data exchange. Here's a breakdown:

    User Authentication: Riders can log in using their phone numbers, get an SMS code, and authenticate. This flow involves the Rider service, which produces a request, and the Notifications service, which consumes it and handles the SMS via Twilio.

    Ride Booking: Riders can book a taxi, and this involves the Rider and Geolocation services working together. Google Maps API is used for getting location data, calculating distances, and managing the route, while the Trips service takes care of the ride's lifecycle and history.

    Driver Functions: Drivers can log in, go online, accept ride requests, view ride details, and decline rides if needed. The Trips service manages everything here, ensuring real-time communication with the rider through WebSockets.

Current Functionality

    User Login via Phone:
        Riders log in with their phone number.
        The system sends an SMS code through the Notifications service.
        Riders enter the code, and the system checks if it matches.

    Ride Booking:
        Riders can book a taxi.
        The system uses Google Maps API for distance calculation and route drawing.
        The Trips service manages ride details and calculates prices.

    Driver Management:
        Drivers can log in, go online, and handle ride requests.
        Real-time updates are provided on ride requests, and drivers can accept or decline them.

Project Architecture

The main goal here was to have one API gateway managing two main services: the Driver and Rider services. These services handle everything else, ensuring the system is modular and scalable.
Tech Stack

    NestJS - For building scalable server-side applications.
    Kafka - Message broker for microservice communication.
    MySQL - Initial database, with plans to switch to PostgreSQL.
    Redis - Used for caching.
    Google Maps API - For location services and route calculation.
    JWT & Passport - For authentication and authorization.
    WebSockets - For real-time data exchange.
    Twilio - For sending SMS messages.

Project Story

This project is one of the biggest challenges I’ve faced in my career. I was originally hired by a contractor to work on it, and I started when I had about two years of experience with Node.js and almost no experience with microservices. I was the only backend developer, so I had to develop the software design and architecture by myself, which took me a month of research. I chose Kafka as the message broker because companies like Uber and Bolt were using it.

Unfortunately, I had to stop working on this project due to some issues with the contractor. Even though it's only 40% finished, it’s still one of the most significant projects I’ve worked on, and maybe one day I’ll be able to complete it.
