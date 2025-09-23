# make-my-way
A trip-planning platform that creates personalized travel itineraries.

```
make-my-way
├─ make-my-way-backend
│  ├─ .env
│  ├─ package-lock.json
│  ├─ package.json
│  └─ src
│     ├─ app.js
│     ├─ config
│     │  ├─ db.js
│     │  ├─ googleClient.js
│     │  └─ supabase.js
│     ├─ controllers
│     │  ├─ auth.controller.js
│     │  ├─ deleteTrip.controller.js
│     │  ├─ getMembers.controller.js
│     │  ├─ getSharedWithUserTrips.controller.js
│     │  ├─ getTripById.controller.js
│     │  ├─ getTripOfUser.controller.js
│     │  ├─ getTripPath.controller.js
│     │  ├─ inviteUser.controller.js
│     │  ├─ leaveSharedTrip.controller.js
│     │  ├─ rejectInvite.controller.js
│     │  ├─ saveTrip.controller.js
│     │  ├─ trip.controller.js
│     │  └─ userController.js
│     ├─ middlewares
│     │  ├─ authMiddleware.js
│     │  ├─ checkTripOwner.js
│     │  └─ verifyJwt.js
│     ├─ models
│     │  ├─ index.js
│     │  ├─ Trip.js
│     │  └─ User.js
│     ├─ routes
│     │  ├─ authRouter.js
│     │  ├─ trip.routes.js
│     │  └─ userRouter.js
│     ├─ seed.js
│     ├─ server.js
│     ├─ services
│     │  ├─ auth.service.js
│     │  ├─ directions.service.js
│     │  ├─ gemini.service.js
│     │  ├─ geocoding.service.js
│     │  ├─ getTripPath.service.js
│     │  ├─ pdf.service.js
│     │  ├─ places.service.js
│     │  └─ planner.service.js
│     └─ utils
│        ├─ mapping.json
│        └─ mappingLoader.js
├─ make-my-way-frontend
│  ├─ .env
│  ├─ .idea
│  │  ├─ inspectionProfiles
│  │  │  └─ Project_Default.xml
│  │  ├─ vcs.xml
│  │  └─ workspace.xml
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ images
│  │  │  ├─ adventure-mode.jpg
│  │  │  ├─ chill-relax.jpg
│  │  │  ├─ city2.jpg
│  │  │  ├─ culture-history.jpg
│  │  │  └─ urban-explorer.jpg
│  │  ├─ index.html
│  │  └─ media
│  │     ├─ favicon-grey.png
│  │     ├─ favicon.png
│  │     ├─ hero1.jpg
│  │     ├─ hero2.jpg
│  │     ├─ hero3.jpg
│  │     ├─ logo-grey.png
│  │     └─ logo.png
│  └─ src
│     ├─ App.js
│     ├─ App.test.js
│     ├─ assets
│     │  └─ logo.png
│     ├─ auth
│     │  ├─ AuthProvider.js
│     │  └─ ProtectedRoute.js
│     ├─ components
│     │  ├─ DebouncedInput.jsx
│     │  ├─ Navbar.jsx
│     │  ├─ TripCard.jsx
│     │  └─ TripForm.jsx
│     ├─ index.css
│     ├─ index.js
│     ├─ pages
│     │  ├─ Dashboard.jsx
│     │  ├─ HomePage.jsx
│     │  ├─ Login.jsx
│     │  ├─ LoginPage.js
│     │  ├─ RegisterPage.js
│     │  ├─ TripFormPage.jsx
│     │  └─ TripResults.jsx
│     ├─ routes
│     │  ├─ authRouter.js
│     │  └─ trip.routes.js
│     ├─ services
│     │  ├─ api.js
│     │  ├─ geoDB.js
│     │  └─ onrender
│     └─ styles
│        ├─ App.css
│        ├─ global.css
│        ├─ HomePage.css
│        ├─ Navbar.css
│        └─ TripForm.css
├─ package-lock.json
└─ README.md

```