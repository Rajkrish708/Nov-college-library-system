/* ============================================================
   CU LIBRARY SEAT FINDER
   COMPLETE UPDATED APP.JS

   MAIN ADMINS:
   26BET130
   26BET152

   STUDENT PASSWORDS:
   ODD  UID  -> tejas
   EVEN UID -> krishu

   FEATURES:
   - 3 Libraries
   - 80 / 120 / 200 Seats
   - Seat features
   - Booking confirmation
   - Booking duration
   - Check-in
   - Personal cancellation notices
   - Main Admin
   - Sub Admins
   - Sub Admin permissions
   - Admin reservations
   - Admin cancellation
   - Booking details
   - Announcements
   - Future feature section
   - No demo reset / demo hints
============================================================ */


/* ============================================================
   1. LIBRARIES
============================================================ */

const LIBRARIES = [

    {
        id: "main",
        name: "Main Library",
        location: "University Main Campus",
        seats: 80
    },

    {
        id: "engineering",
        name: "Engineering Library",
        location: "Engineering Block",
        seats: 120
    },

    {
        id: "central",
        name: "Central Library",
        location: "Central Campus",
        seats: 200
    }

];


/* ============================================================
   2. MAIN ADMINS
============================================================ */

const MAIN_ADMINS = [

    "26BET130",
    "26BET152"

];


/* ============================================================
   3. PASSWORDS
============================================================ */

const PASSWORDS = {

    odd: "tejas",

    even: "krishu"

};


/* ============================================================
   4. STORAGE KEYS
============================================================ */

const STORAGE = {

    bookings: "cu_bookings",

    subAdmins: "cu_subadmins",

    notices: "cu_notices",

    announcements: "cu_announcements",

    user: "cu_user",

    library: "cu_library"

};


/* ============================================================
   5. SAFE STORAGE READER
============================================================ */

function readStorage(key, fallback) {

    try {

        const value =
            localStorage.getItem(key);

        if (!value) {

            return fallback;
        }

        return JSON.parse(value);

    } catch (error) {

        console.error(
            "Storage read error:",
            error
        );

        return fallback;
    }
}


/* ============================================================
   6. DATA
============================================================ */

let bookings =
    readStorage(
        STORAGE.bookings,
        []
    );


let subAdmins =
    readStorage(
        STORAGE.subAdmins,
        []
    );


let notices =
    readStorage(
        STORAGE.notices,
        []
    );


let announcements =
    readStorage(
        STORAGE.announcements,
        []
    );


let currentUser =
    localStorage.getItem(
        STORAGE.user
    ) || "";


let selectedLibrary =
    localStorage.getItem(
        STORAGE.library
    ) || "";


let adminTargetUID = "";


/* ============================================================
   7. SAVE ALL
============================================================ */

function saveAll() {

    localStorage.setItem(
        STORAGE.bookings,
        JSON.stringify(bookings)
    );

    localStorage.setItem(
        STORAGE.subAdmins,
        JSON.stringify(subAdmins)
    );

    localStorage.setItem(
        STORAGE.notices,
        JSON.stringify(notices)
    );

    localStorage.setItem(
        STORAGE.announcements,
        JSON.stringify(announcements)
    );
}


/* ============================================================
   8. HTML ESCAPE
============================================================ */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* ============================================================
   9. UID VALIDATION
============================================================ */

function validUID(uid) {

    if (
        !/^26BET\d{3}$/.test(uid)
    ) {

        return false;
    }

    const number =
        parseInt(
            uid.slice(-3),
            10
        );

    return (
        number >= 1 &&
        number <= 200
    );
}


/* ============================================================
   10. PASSWORD VALIDATION
============================================================ */

function passwordCorrect(
    uid,
    password
) {

    if (
        MAIN_ADMINS.includes(uid)
    ) {

        return (
            password ===
            PASSWORDS.even
        );
    }


    const number =
        parseInt(
            uid.slice(-3),
            10
        );


    if (
        number % 2 === 0
    ) {

        return (
            password ===
            PASSWORDS.even
        );
    }


    return (
        password ===
        PASSWORDS.odd
    );
}


/* ============================================================
   11. LOGIN
============================================================ */

function login() {

    const uidInput =
        document.getElementById(
            "uid"
        );


    const passwordInput =
        document.getElementById(
            "password"
        );


    const error =
        document.getElementById(
            "loginError"
        );


    const uid =
        uidInput.value
            .trim()
            .toUpperCase();


    const password =
        passwordInput.value;


    error.textContent = "";


    if (!validUID(uid)) {

        error.textContent =
            "Please enter a valid university UID.";

        return;
    }


    if (
        !passwordCorrect(
            uid,
            password
        )
    ) {

        error.textContent =
            "Incorrect UID or password.";

        return;
    }


    currentUser = uid;


    localStorage.setItem(
        STORAGE.user,
        currentUser
    );


    document
        .getElementById(
            "loginPage"
        )
        .classList
        .add("hidden");


    document
        .getElementById(
            "appPage"
        )
        .classList
        .remove("hidden");


    setupDashboard();
}


/* ============================================================
   12. LOGOUT
============================================================ */

function logout() {

    localStorage.removeItem(
        STORAGE.user
    );

    localStorage.removeItem(
        STORAGE.library
    );

    location.reload();
}


/* ============================================================
   13. PAGE LOAD
============================================================ */

window.addEventListener(
    "load",
    function () {

        if (currentUser) {

            document
                .getElementById(
                    "loginPage"
                )
                .classList
                .add("hidden");


            document
                .getElementById(
                    "appPage"
                )
                .classList
                .remove("hidden");


            setupDashboard();

        } else {

            document
                .getElementById(
                    "loginPage"
                )
                .classList
                .remove("hidden");


            document
                .getElementById(
                    "appPage"
                )
                .classList
                .add("hidden");
        }

    }
);


/* ============================================================
   14. MAIN ADMIN
============================================================ */

function isMainAdmin() {

    return MAIN_ADMINS.includes(
        currentUser
    );
}


/* ============================================================
   15. GET SUB ADMIN
============================================================ */

function getSubAdmin(
    uid = currentUser
) {

    return subAdmins.find(
        admin =>
            admin.uid === uid
    );
}


/* ============================================================
   16. STAFF CHECK
============================================================ */

function isStaff() {

    return (
        isMainAdmin() ||
        !!getSubAdmin()
    );
}


/* ============================================================
   17. PERMISSIONS
============================================================ */

function permissions() {

    if (isMainAdmin()) {

        return {

            cancel: true,

            reserve: true,

            view: true,

            announce: true,

            manage: true

        };
    }


    const admin =
        getSubAdmin();


    if (!admin) {

        return {

            cancel: false,

            reserve: false,

            view: false,

            announce: false,

            manage: false

        };
    }


    return {

        cancel:
            !!admin.cancel,

        reserve:
            !!admin.reserve,

        view:
            !!admin.view,

        announce:
            !!admin.announce,

        manage: false

    };
}


/* ============================================================
   18. DASHBOARD SETUP
============================================================ */

function setupDashboard() {

    const welcome =
        document.getElementById(
            "welcomeText"
        );


    const userUid =
        document.getElementById(
            "userUid"
        );


    if (welcome) {

        welcome.textContent =
            "Welcome, " +
            currentUser;
    }


    if (userUid) {

        userUid.textContent =
            currentUser;
    }


    const adminButton =
        document.getElementById(
            "adminButton"
        );


    if (
        adminButton
    ) {

        if (isStaff()) {

            adminButton
                .classList
                .remove("hidden");

        } else {

            adminButton
                .classList
                .add("hidden");
        }
    }


    renderLibraries();

    renderMyBooking();

    renderNotices();

    renderAnnouncements();


    if (selectedLibrary) {

        openLibrary(
            selectedLibrary,
            false
        );
    }
}


/* ============================================================
   19. LIBRARY NAME
============================================================ */

function getLibraryName(id) {

    const library =
        LIBRARIES.find(
            item =>
                item.id === id
        );


    return library
        ? library.name
        : id;
}


/* ============================================================
   20. RENDER LIBRARIES
============================================================ */

function renderLibraries() {

    const container =
        document.getElementById(
            "libraryCards"
        );


    if (!container) return;


    container.innerHTML = "";


    LIBRARIES.forEach(
        library => {

            const occupied =
                bookings.filter(
                    booking =>

                        booking.libraryId ===
                        library.id

                        &&

                        booking.status ===
                        "active"

                ).length;


            const available =
                Math.max(
                    0,
                    library.seats -
                    occupied
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "library-card";


            card.innerHTML = `

                <h3>
                    📚
                    ${escapeHTML(
                library.name
            )}
                </h3>

                <p>
                    📍
                    ${escapeHTML(
                library.location
            )}
                </p>

                <p>
                    🪑 Total Seats:
                    <b>
                        ${library.seats}
                    </b>
                </p>

                <p>
                    🟢 Available:
                    <b>
                        ${available}
                    </b>
                </p>

                <p>
                    🔴 Occupied:
                    <b>
                        ${occupied}
                    </b>
                </p>

                <button
                    onclick="
                    openLibrary(
                        '${library.id}'
                    )">

                    View Seats

                </button>

            `;


            container.appendChild(
                card
            );
        }
    );
}


/* ============================================================
   21. OPEN LIBRARY
============================================================ */

function openLibrary(
    id,
    shouldScroll = true
) {

    const library =
        LIBRARIES.find(
            item =>
                item.id === id
        );


    if (!library) return;


    selectedLibrary = id;


    localStorage.setItem(
        STORAGE.library,
        id
    );


    const section =
        document.getElementById(
            "seatSection"
        );


    const title =
        document.getElementById(
            "libraryTitle"
        );


    section
        .classList
        .remove("hidden");


    title.textContent =
        library.name +
        " - Seats";


    renderSeats();


    if (shouldScroll) {

        setTimeout(
            function () {

                section.scrollIntoView({
                    behavior:
                        "smooth"
                });

            },
            100
        );
    }
}


/* ============================================================
   22. CLOSE SEATS
============================================================ */

function closeSeats() {

    document
        .getElementById(
            "seatSection"
        )
        .classList
        .add("hidden");
}


/* ============================================================
   23. SEAT PROFILE
============================================================ */

function seatProfile(number) {

    if (
        number % 10 === 0
    ) {

        return {

            type:
                "Premium Study Seat",

            features: [

                "🔌 Charging Plug",

                "📶 High-Speed Wi-Fi",

                "💺 Ergonomic Chair",

                "💡 Study Lamp",

                "🤫 Quiet Zone"

            ]

        };
    }


    if (
        number % 7 === 0
    ) {

        return {

            type:
                "Window Study Seat",

            features: [

                "🔌 Charging Plug",

                "📶 Wi-Fi",

                "🪟 Window View",

                "💺 Comfortable Chair"

            ]

        };
    }


    if (
        number % 5 === 0
    ) {

        return {

            type:
                "Focus / Quiet Seat",

            features: [

                "📶 Wi-Fi",

                "🤫 Quiet Zone",

                "💺 Comfortable Chair",

                "📚 Individual Study Space"

            ]

        };
    }


    return {

        type:
            "Standard Study Seat",

        features: [

            "📶 Wi-Fi",

            "💺 Study Chair",

            "📚 Individual Study Space"

        ]

    };
}


/* ============================================================
   24. SEAT ID
============================================================ */

function seatId(
    libraryId,
    number
) {

    return (
        libraryId +
        "-" +
        number
    );
}


/* ============================================================
   25. RENDER SEATS
============================================================ */

function renderSeats() {

    if (!selectedLibrary) {
        return;
    }


    const library =
        LIBRARIES.find(
            item =>
                item.id ===
                selectedLibrary
        );


    if (!library) return;


    const grid =
        document.getElementById(
            "seatGrid"
        );


    if (!grid) return;


    grid.innerHTML = "";


    for (
        let number = 1;
        number <= library.seats;
        number++
    ) {

        const id =
            seatId(
                library.id,
                number
            );


        const booking =
            bookings.find(
                item =>

                    item.id === id

                    &&

                    item.status ===
                    "active"

            );


        const profile =
            seatProfile(number);


        const seat =
            document.createElement(
                "div"
            );


        seat.className =
            booking
                ? "seat busy-seat"
                : "seat free-seat";


        seat.innerHTML = `

            <strong>
                S${number}
            </strong>

            <small>
                ${booking
                ? "Occupied"
                : "Available"
            }
            </small>

        `;


        seat.onclick =
            function () {

                if (booking) {

                    openOccupiedSeat(
                        booking,
                        profile
                    );

                    return;
                }


                if (

                    isStaff()

                    &&

                    permissions()
                        .reserve

                    &&

                    adminTargetUID

                ) {

                    adminReserveSeat(
                        id,
                        library,
                        number,
                        profile
                    );

                    return;
                }


                openFreeSeat(
                    id,
                    library,
                    number,
                    profile
                );
            };


        grid.appendChild(
            seat
        );
    }
}


/* ============================================================
   26. OPEN FREE SEAT
============================================================ */

function openFreeSeat(
    id,
    library,
    number,
    profile
) {

    const features =
        profile.features
            .map(
                feature => `

                    <div class="feature">
                        ${escapeHTML(
                    feature
                )}
                    </div>

                `
            )
            .join("");


    showModal(`

        <h2>
            🪑 Seat S${number}
        </h2>


        <div class="info-box">

            <p>
                <b>Library:</b>
                ${escapeHTML(
        library.name
    )}
            </p>

            <p>
                <b>Seat Type:</b>
                ${escapeHTML(
        profile.type
    )}
            </p>

        </div>


        <h3>
            Seat Features
        </h3>


        <div class="feature-list">

            ${features}

        </div>


        <h3>
            Select Duration
        </h3>


        <select
            id="durationSelect"
            class="duration-select">

            <option value="1">
                1 Hour
            </option>

            <option value="2">
                2 Hours
            </option>

            <option value="3">
                3 Hours
            </option>

            <option value="4">
                4 Hours
            </option>

            <option value="5">
                5 Hours
            </option>

        </select>


        <button
            class="primary-btn"
            onclick="
                continueBooking(
                    '${id}',
                    '${library.id}',
                    ${number}
                )">

            Continue to Booking

        </button>

    `);
}


/* ============================================================
   27. CONTINUE BOOKING
============================================================ */

function continueBooking(
    id,
    libraryId,
    number
) {

    const select =
        document.getElementById(
            "durationSelect"
        );


    if (!select) return;


    const duration =
        parseInt(
            select.value,
            10
        );


    const library =
        LIBRARIES.find(
            item =>
                item.id ===
                libraryId
        );


    const profile =
        seatProfile(number);


    closeModal();


    setTimeout(
        function () {

            showConfirmation(
                id,
                library,
                number,
                profile,
                duration
            );

        },
        100
    );
}


/* ============================================================
   28. CONFIRM BOOKING
============================================================ */

function showConfirmation(
    id,
    library,
    number,
    profile,
    duration
) {

    showModal(`

        <h2>
            Confirm Booking
        </h2>


        <div class="info-box">

            <p>
                <b>Student:</b>
                ${escapeHTML(
        currentUser
    )}
            </p>

            <p>
                <b>Library:</b>
                ${escapeHTML(
        library.name
    )}
            </p>

            <p>
                <b>Seat:</b>
                S${number}
            </p>

            <p>
                <b>Seat Type:</b>
                ${escapeHTML(
        profile.type
    )}
            </p>

            <p>
                <b>Duration:</b>
                ${duration}
                hour(s)
            </p>

        </div>


        <div class="admin-note">

            After confirming, you have
            <b>10 minutes</b>
            to check in.

        </div>


        <button
            class="primary-btn"
            onclick="
                createBooking(
                    '${id}',
                    '${library.id}',
                    ${number},
                    ${duration},
                    '${profile.type}'
                )">

            Confirm Booking

        </button>

    `);
}


/* ============================================================
   29. CREATE BOOKING
============================================================ */

function createBooking(
    id,
    libraryId,
    number,
    duration,
    seatType,
    targetUID = currentUser,
    createdBy = currentUser
) {

    const existing =
        bookings.find(
            booking =>

                booking.id === id

                &&

                booking.status ===
                "active"

        );


    if (existing) {

        alert(
            "This seat is already occupied."
        );

        closeModal();

        renderSeats();

        return;
    }


    /*
       Normal student:
       only one active booking.

       Staff:
       can reserve multiple seats.
    */

    if (

        targetUID === currentUser

        &&

        !isStaff()

    ) {

        const already =
            bookings.find(
                booking =>

                    booking.uid ===
                    currentUser

                    &&

                    booking.status ===
                    "active"

            );


        if (already) {

            alert(
                "You already have an active seat booking."
            );

            closeModal();

            return;
        }
    }


    const now =
        Date.now();


    const booking = {

        id: id,

        libraryId: libraryId,

        seatNumber: number,

        uid: targetUID,

        bookedBy: createdBy,

        duration: duration,

        seatType: seatType,

        status: "active",

        createdAt: now,

        checkInDeadline:
            now +
            10 * 60 * 1000,

        endAt:
            now +
            duration *
            60 *
            60 *
            1000,

        checkedIn: false

    };


    bookings.push(
        booking
    );


    saveAll();


    closeModal();


    renderSeats();

    renderLibraries();

    renderMyBooking();


    alert(
        "Seat S" +
        number +
        " booked successfully."
    );
}


/* ============================================================
   30. MY BOOKING
============================================================ */

function renderMyBooking() {

    const container =
        document.getElementById(
            "myBooking"
        );


    if (!container) return;


    const booking =
        bookings.find(
            item =>

                item.uid ===
                currentUser

                &&

                item.status ===
                "active"

        );


    if (!booking) {

        container.innerHTML = `

            <div class="empty-state">
                No active booking.
            </div>

        `;

        return;
    }


    const library =
        LIBRARIES.find(
            item =>
                item.id ===
                booking.libraryId
        );


    const remaining =
        Math.max(
            0,
            booking.endAt -
            Date.now()
        );


    const minutes =
        Math.floor(
            remaining /
            60000
        );


    container.innerHTML = `

        <div class="booking-card">

            <p>
                <b>Library:</b>
                ${escapeHTML(
        library
            ? library.name
            : booking.libraryId
    )}
            </p>

            <p>
                <b>Seat:</b>
                S${booking.seatNumber}
            </p>

            <p>
                <b>Seat Type:</b>
                ${escapeHTML(
        booking.seatType
    )}
            </p>

            <p>
                <b>Duration:</b>
                ${booking.duration}
                hour(s)
            </p>

            <p>
                <b>Time Remaining:</b>
                ${minutes}
                minute(s)
            </p>

            <p>
                <b>Check-in:</b>
                ${booking.checkedIn
            ? "Checked In"
            : "Pending"
        }
            </p>


            ${!booking.checkedIn

            ?

            `

                <button
                    class="success-btn"
                    onclick="
                        checkIn(
                            '${booking.id}'
                        )">

                    ✓ Check In

                </button>

                `

            :

            ""
        }


            <button
                class="danger-btn"
                onclick="
                    cancelOwnBooking(
                        '${booking.id}'
                    )">

                Cancel My Booking

            </button>

        </div>

    `;
}


/* ============================================================
   31. CHECK IN
============================================================ */

function checkIn(id) {

    const booking =
        bookings.find(
            item =>

                item.id === id

                &&

                item.uid ===
                currentUser

                &&

                item.status ===
                "active"

        );


    if (!booking) {

        alert(
            "Booking not found."
        );

        return;
    }


    if (
        Date.now() >
        booking.checkInDeadline
    ) {

        alert(
            "The 10-minute check-in period has expired."
        );

        return;
    }


    booking.checkedIn =
        true;


    booking.checkedInAt =
        Date.now();


    saveAll();


    renderMyBooking();

    renderSeats();


    alert(
        "Check-in successful."
    );
}


/* ============================================================
   32. CANCEL OWN BOOKING
============================================================ */

function cancelOwnBooking(id) {

    const booking =
        bookings.find(
            item =>

                item.id === id

                &&

                item.uid ===
                currentUser

                &&

                item.status ===
                "active"

        );


    if (!booking) return;


    booking.status =
        "cancelled";


    booking.cancelReason =
        "Cancelled by student";


    booking.cancelledBy =
        currentUser;


    booking.cancelledAt =
        Date.now();


    saveAll();


    renderMyBooking();

    renderSeats();

    renderLibraries();


    alert(
        "Your booking has been cancelled."
    );
}


/* ============================================================
   33. OPEN OCCUPIED SEAT
============================================================ */

function openOccupiedSeat(
    booking,
    profile
) {

    const p =
        permissions();


    const isOwner =
        booking.uid ===
        currentUser;


    if (
        !p.view &&
        !isOwner
    ) {

        alert(
            "You do not have permission to view this booking."
        );

        return;
    }


    let buttons = "";


    if (
        p.cancel ||
        isOwner
    ) {

        buttons += `

            <button
                class="danger-btn"
                onclick="
                    staffCancelBooking(
                        '${booking.id}'
                    )">

                Cancel Reservation

            </button>

        `;
    }


    showModal(`

        <h2>
            🪑 Seat S${booking.seatNumber}
        </h2>


        <div class="info-box">

            <p>
                <b>Status:</b>
                Occupied
            </p>

            <p>
                <b>Student UID:</b>
                ${escapeHTML(
        booking.uid
    )}
            </p>

            <p>
                <b>Booked By:</b>
                ${escapeHTML(
        booking.bookedBy
    )}
            </p>

            <p>
                <b>Duration:</b>
                ${booking.duration}
                hour(s)
            </p>

            <p>
                <b>Seat Type:</b>
                ${escapeHTML(
        profile.type
    )}
            </p>

            <p>
                <b>Checked In:</b>
                ${booking.checkedIn
            ? "Yes"
            : "No"
        }
            </p>

            <p>
                <b>Booking Time:</b>
                ${new Date(
            booking.createdAt
        ).toLocaleString()}
            </p>

            <p>
                <b>End Time:</b>
                ${new Date(
            booking.endAt
        ).toLocaleString()}
            </p>

        </div>


        <h3>
            Seat Features
        </h3>


        <div class="feature-list">

            ${profile.features
            .map(
                feature => `

                            <div class="feature">
                                ${escapeHTML(
                    feature
                )}
                            </div>

                        `
            )
            .join("")
        }

        </div>


        ${buttons}

    `);
}


/* ============================================================
   34. STAFF CANCEL BOOKING
============================================================ */

function staffCancelBooking(id) {

    const p =
        permissions();


    const booking =
        bookings.find(
            item =>

                item.id === id

                &&

                item.status ===
                "active"

        );


    if (!booking) {

        alert(
            "Booking not found."
        );

        return;
    }


    const isOwner =
        booking.uid ===
        currentUser;


    if (
        !isOwner &&
        !p.cancel
    ) {

        alert(
            "You do not have permission to cancel this reservation."
        );

        return;
    }


    const reason =
        prompt(
            "Enter the reason for cancellation:"
        );


    if (
        !reason ||
        !reason.trim()
    ) {

        alert(
            "Cancellation reason is required."
        );

        return;
    }


    booking.status =
        "cancelled";


    booking.cancelReason =
        reason.trim();


    booking.cancelledBy =
        currentUser;


    booking.cancelledAt =
        Date.now();


    notices.push({

        id:
            Date.now() +
            Math.random(),

        uid:
            booking.uid,

        message:

            "Your seat S" +
            booking.seatNumber +

            " in " +

            getLibraryName(
                booking.libraryId
            ) +

            " was cancelled by " +

            currentUser +

            ". Reason: " +

            reason.trim(),

        time:
            Date.now(),

        read: false

    });


    saveAll();


    closeModal();


    renderSeats();

    renderLibraries();

    renderMyBooking();

    renderNotices();


    alert(
        "Reservation cancelled. The student has been notified."
    );
}


/* ============================================================
   35. PERSONAL NOTICES
============================================================ */

function renderNotices() {

    const area =
        document.getElementById(
            "noticeArea"
        );


    if (!area) return;


    const mine =
        notices.filter(
            notice =>

                notice.uid ===
                currentUser

                &&

                !notice.read

        );


    if (!mine.length) {

        area.innerHTML = "";

        return;
    }


    area.innerHTML = `

        <section class="dashboard-section">

            <div class="section-heading">

                <div>

                    <span class="section-kicker">
                        IMPORTANT
                    </span>

                    <h2>
                        🔔 Your Notifications
                    </h2>

                </div>

            </div>


            ${mine
            .map(
                notice => `

                            <div class="announcement">

                                <div
                                    class="announcement-header">

                                    <div
                                        class="announcement-title">

                                        Reservation Update

                                    </div>

                                </div>


                                <div
                                    class="announcement-message">

                                    ${escapeHTML(
                    notice.message
                )}

                                </div>


                                <div
                                    class="announcement-meta">

                                    ${new Date(
                    notice.time
                ).toLocaleString()}

                                </div>


                                <button
                                    class="secondary-btn"
                                    onclick="
                                        readNotice(
                                            '${notice.id}'
                                        )">

                                    Mark as Read

                                </button>

                            </div>

                        `
            )
            .join("")
        }

        </section>

    `;
}


/* ============================================================
   36. READ NOTICE
============================================================ */

function readNotice(id) {

    const notice =
        notices.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!notice) return;


    notice.read =
        true;


    saveAll();


    renderNotices();
}


/* ============================================================
   37. ANNOUNCEMENTS
============================================================ */

function renderAnnouncements() {

    const area =
        document.getElementById(
            "announcementArea"
        );


    if (!area) return;


    const active =
        announcements
            .filter(
                item =>
                    item.active !== false
            )
            .sort(
                (
                    a,
                    b
                ) =>
                    b.time -
                    a.time
            );


    if (!active.length) {

        area.innerHTML = `

            <div class="empty-state">
                No announcements right now.
            </div>

        `;

        return;
    }


    area.innerHTML =
        active
            .map(
                announcement => {

                    const canDelete =
                        announcement.by ===
                        currentUser
                        ||
                        isMainAdmin();


                    return `

                        <div
                            class="announcement">

                            <div
                                class="announcement-header">

                                <div
                                    class="announcement-title">

                                    📢
                                    ${escapeHTML(
                        announcement.title
                    )}

                                </div>


                                ${canDelete

                            ?

                            `

                                    <button
                                        class="
                                        announcement-delete
                                        "
                                        onclick="
                                            deleteAnnouncement(
                                                '${announcement.id}'
                                            )">

                                        Delete

                                    </button>

                                    `

                            :

                            ""
                        }

                            </div>


                            <div
                                class="
                                announcement-message
                                ">

                                ${escapeHTML(
                            announcement.message
                        )}

                            </div>


                            <div
                                class="
                                announcement-meta
                                ">

                                Posted by
                                ${escapeHTML(
                            announcement.by
                        )}

                                •

                                ${new Date(
                            announcement.time
                        ).toLocaleString()}

                            </div>

                        </div>

                    `;
                }
            )
            .join("");
}


/* ============================================================
   38. POST ANNOUNCEMENT
============================================================ */

function postAnnouncement() {

    const p =
        permissions();


    if (!p.announce) {

        alert(
            "You do not have permission to post announcements."
        );

        return;
    }


    const titleInput =
        document.getElementById(
            "announcementTitle"
        );


    const messageInput =
        document.getElementById(
            "announcementMessage"
        );


    if (
        !titleInput ||
        !messageInput
    ) {

        return;
    }


    const title =
        titleInput.value.trim();


    const message =
        messageInput.value.trim();


    if (!title) {

        alert(
            "Please enter an announcement title."
        );

        return;
    }


    if (!message) {

        alert(
            "Please enter an announcement message."
        );

        return;
    }


    announcements.push({

        id:
            Date.now() +
            Math.random(),

        title: title,

        message: message,

        by: currentUser,

        time: Date.now(),

        active: true

    });


    saveAll();


    titleInput.value = "";

    messageInput.value = "";


    renderAnnouncements();


    alert(
        "Announcement posted successfully."
    );
}


/* ============================================================
   39. DELETE ANNOUNCEMENT
============================================================ */

function deleteAnnouncement(id) {

    const item =
        announcements.find(
            announcement =>
                String(
                    announcement.id
                ) ===
                String(id)
        );


    if (!item) return;


    if (
        item.by !== currentUser &&
        !isMainAdmin()
    ) {

        alert(
            "You cannot delete this announcement."
        );

        return;
    }


    const confirmed =
        confirm(
            "Delete this announcement?"
        );


    if (!confirmed) return;


    announcements =
        announcements.filter(
            announcement =>
                String(
                    announcement.id
                ) !==
                String(id)
        );


    saveAll();


    renderAnnouncements();
}


/* ============================================================
   40. MODAL
============================================================ */

function showModal(html) {

    const modal =
        document.getElementById(
            "modal"
        );


    const content =
        document.getElementById(
            "modalContent"
        );


    if (!modal || !content) {
        return;
    }


    content.innerHTML =
        html;


    modal
        .classList
        .remove("hidden");
}


/* ============================================================
   41. CLOSE MODAL
============================================================ */

function closeModal() {

    const modal =
        document.getElementById(
            "modal"
        );


    if (!modal) return;


    modal
        .classList
        .add("hidden");
}


/* ============================================================
   42. OPEN ADMIN
============================================================ */

function openAdmin() {

    if (!isStaff()) {

        alert(
            "You do not have admin access."
        );

        return;
    }


    const p =
        permissions();


    let html = `

        <div class="admin-title">

            <h2>
                ⚙ Admin Panel
            </h2>

        </div>


        <div class="info-box">

            <p>
                <b>Logged in:</b>
                ${escapeHTML(
        currentUser
    )}
            </p>

            <p>
                <b>Role:</b>
                ${isMainAdmin()
            ? "Main Admin"
            : "Sub Admin"
        }
            </p>

            <p>
                <b>Cancel Reservations:</b>
                ${p.cancel ? "Yes" : "No"}
            </p>

            <p>
                <b>Reserve Seats:</b>
                ${p.reserve ? "Yes" : "No"}
            </p>

            <p>
                <b>View Booking Details:</b>
                ${p.view ? "Yes" : "No"}
            </p>

            <p>
                <b>Post Announcements:</b>
                ${p.announce ? "Yes" : "No"}
            </p>

        </div>

    `;


    /* ========================================================
       ANNOUNCEMENT
    ======================================================== */

    if (p.announce) {

        html += `

            <div class="admin-section">

                <h3>
                    📢 Post Announcement
                </h3>

                <input
                    id="announcementTitle"
                    class="duration-select"
                    placeholder="Announcement title">

                <textarea
                    id="announcementMessage"
                    class="duration-select"
                    rows="4"
                    placeholder="Write your announcement..."></textarea>

                <button
                    class="primary-btn"
                    onclick="
                        postAnnouncement()
                    ">

                    Publish Announcement

                </button>

            </div>

        `;
    }


    /* ========================================================
       RESERVE SEAT
    ======================================================== */

    if (p.reserve) {

        html += `

            <div class="admin-section">

                <h3>
                    🪑 Reserve Seat For Any UID
                </h3>

                <p class="admin-note">

                    Enter a student's UID,
                    then select as many available
                    seats as required.

                </p>

                <input
                    id="adminUID"
                    class="duration-select"
                    placeholder="Enter UID e.g. 26BET101">

                <button
                    class="primary-btn"
                    onclick="
                        adminReserveMode()
                    ">

                    Select Seat To Reserve

                </button>

            </div>

        `;
    }


    /* ========================================================
       MAIN ADMIN ONLY
    ======================================================== */

    if (p.manage) {

        html += `

            <div class="admin-section">

                <h3>
                    👥 Manage Sub-Admins
                </h3>

                <p class="admin-note">

                    Main admins can completely
                    control which features each
                    sub-admin can use.

                </p>


                <input
                    id="subUID"
                    class="duration-select"
                    placeholder="Enter sub-admin UID">


                <div
                    class="permission-card">

                    <label
                        class="permission-row">

                        <input
                            type="checkbox"
                            id="subCancel">

                        Cancel Reservations

                    </label>


                    <label
                        class="permission-row">

                        <input
                            type="checkbox"
                            id="subReserve">

                        Reserve Seats

                    </label>


                    <label
                        class="permission-row">

                        <input
                            type="checkbox"
                            id="subView">

                        View Booking Details

                    </label>


                    <label
                        class="permission-row">

                        <input
                            type="checkbox"
                            id="subAnnounce">

                        Post Announcements

                    </label>

                </div>


                <button
                    class="primary-btn"
                    onclick="
                        saveSubAdmin()
                    ">

                    Add / Update Sub-Admin

                </button>


                <div
                    id="subAdminList">
                </div>

            </div>

        `;
    }


    /* ========================================================
       ACTIVE BOOKINGS
    ======================================================== */

    if (p.view) {

        html += `

            <div class="admin-section">

                <h3>
                    📋 Active Reservations
                </h3>

                <div
                    id="adminBookings">
                </div>

            </div>

        `;
    }


    showModal(html);


    if (p.manage) {

        renderSubAdmins();
    }


    if (p.view) {

        renderAdminBookings();
    }
}


/* ============================================================
   43. ADMIN RESERVE MODE
============================================================ */

function adminReserveMode() {

    const input =
        document.getElementById(
            "adminUID"
        );


    if (!input) return;


    const uid =
        input.value
            .trim()
            .toUpperCase();


    if (!validUID(uid)) {

        alert(
            "Please enter a valid student UID."
        );

        return;
    }


    adminTargetUID =
        uid;


    closeModal();


    alert(
        "Reserve mode is active. Select an available seat."
    );


    if (!selectedLibrary) {

        selectedLibrary =
            "main";
    }


    openLibrary(
        selectedLibrary
    );
}


/* ============================================================
   44. ADMIN RESERVE SEAT
============================================================ */

function adminReserveSeat(
    id,
    library,
    number,
    profile
) {

    if (!adminTargetUID) {

        return;
    }


    const p =
        permissions();


    if (!p.reserve) {

        adminTargetUID =
            "";

        return;
    }


    let duration =
        prompt(
            "Enter duration in hours (1-5):",
            "2"
        );


    duration =
        parseInt(
            duration,
            10
        );


    if (
        isNaN(duration) ||
        duration < 1 ||
        duration > 5
    ) {

        alert(
            "Duration must be between 1 and 5 hours."
        );

        return;
    }


    const confirmed =
        confirm(

            "Reserve Seat S" +
            number +

            " for UID " +
            adminTargetUID +

            " for " +
            duration +

            " hour(s)?"

        );


    if (!confirmed) {

        return;
    }


    createBooking(

        id,

        library.id,

        number,

        duration,

        profile.type,

        adminTargetUID,

        currentUser

    );


    /*
       Important:
       We keep adminTargetUID active.

       This allows the admin to reserve
       multiple seats for the same UID.
    */

    renderSeats();
}


/* ============================================================
   45. SAVE SUB ADMIN
============================================================ */

function saveSubAdmin() {

    if (!isMainAdmin()) {

        alert(
            "Only main admins can manage sub-admins."
        );

        return;
    }


    const uidInput =
        document.getElementById(
            "subUID"
        );


    if (!uidInput) return;


    const uid =
        uidInput.value
            .trim()
            .toUpperCase();


    if (!validUID(uid)) {

        alert(
            "Please enter a valid UID."
        );

        return;
    }


    if (
        MAIN_ADMINS.includes(uid)
    ) {

        alert(
            "Main admins cannot be assigned as sub-admins."
        );

        return;
    }


    const data = {

        uid: uid,

        cancel:
            document
                .getElementById(
                    "subCancel"
                )
                .checked,

        reserve:
            document
                .getElementById(
                    "subReserve"
                )
                .checked,

        view:
            document
                .getElementById(
                    "subView"
                )
                .checked,

        announce:
            document
                .getElementById(
                    "subAnnounce"
                )
                .checked

    };


    const existing =
        subAdmins.find(
            admin =>
                admin.uid === uid
        );


    if (existing) {

        Object.assign(
            existing,
            data
        );

    } else {

        subAdmins.push(
            data
        );
    }


    saveAll();


    alert(
        "Sub-admin permissions updated successfully."
    );


    openAdmin();
}


/* ============================================================
   46. EDIT SUB ADMIN
============================================================ */

function editSubAdmin(uid) {

    if (!isMainAdmin()) {
        return;
    }


    const admin =
        getSubAdmin(uid);


    if (!admin) return;


    const uidInput =
        document.getElementById(
            "subUID"
        );


    const cancel =
        document.getElementById(
            "subCancel"
        );


    const reserve =
        document.getElementById(
            "subReserve"
        );


    const view =
        document.getElementById(
            "subView"
        );


    const announce =
        document.getElementById(
            "subAnnounce"
        );


    if (uidInput) {
        uidInput.value =
            admin.uid;
    }


    if (cancel) {
        cancel.checked =
            !!admin.cancel;
    }


    if (reserve) {
        reserve.checked =
            !!admin.reserve;
    }


    if (view) {
        view.checked =
            !!admin.view;
    }


    if (announce) {
        announce.checked =
            !!admin.announce;
    }
}


/* ============================================================
   47. RENDER SUB ADMINS
============================================================ */

function renderSubAdmins() {

    const area =
        document.getElementById(
            "subAdminList"
        );


    if (!area) return;


    if (!subAdmins.length) {

        area.innerHTML = `

            <div class="empty-state">

                No sub-admins assigned yet.

            </div>

        `;

        return;
    }


    area.innerHTML = `

        <div
            style="
            margin-top:15px;
            ">

            ${subAdmins
            .map(
                admin => `

                            <div
                                class="
                                permission-card
                                ">

                                <b>
                                    ${escapeHTML(
                    admin.uid
                )}
                                </b>


                                <p
                                    style="
                                    margin-top:8px;
                                    font-size:12px;
                                    ">

                                    Cancel:
                                    ${admin.cancel
                        ? "✓"
                        : "✕"
                    }

                                    &nbsp;&nbsp;

                                    Reserve:
                                    ${admin.reserve
                        ? "✓"
                        : "✕"
                    }

                                    &nbsp;&nbsp;

                                    View:
                                    ${admin.view
                        ? "✓"
                        : "✕"
                    }

                                    &nbsp;&nbsp;

                                    Announce:
                                    ${admin.announce
                        ? "✓"
                        : "✕"
                    }

                                </p>


                                <button
                                    class="
                                    mini-btn
                                    mini-primary
                                    "
                                    onclick="
                                        editSubAdmin(
                                            '${admin.uid}'
                                        )">

                                    Edit Permissions

                                </button>


                                <button
                                    class="
                                    mini-btn
                                    mini-danger
                                    "
                                    onclick="
                                        removeSubAdmin(
                                            '${admin.uid}'
                                        )">

                                    Remove

                                </button>

                            </div>

                        `
            )
            .join("")
        }

        </div>

    `;
}


/* ============================================================
   48. REMOVE SUB ADMIN
============================================================ */

function removeSubAdmin(uid) {

    if (!isMainAdmin()) {

        alert(
            "Only main admins can remove sub-admins."
        );

        return;
    }


    const confirmed =
        confirm(
            "Remove " +
            uid +
            " as a sub-admin?"
        );


    if (!confirmed) {
        return;
    }


    subAdmins =
        subAdmins.filter(
            admin =>
                admin.uid !== uid
        );


    saveAll();


    openAdmin();
}


/* ============================================================
   49. ADMIN BOOKING LIST
============================================================ */

function renderAdminBookings() {

    const area =
        document.getElementById(
            "adminBookings"
        );


    if (!area) return;


    const active =
        bookings.filter(
            booking =>
                booking.status ===
                "active"
        );


    if (!active.length) {

        area.innerHTML = `

            <div class="empty-state">
                No active reservations.
            </div>

        `;

        return;
    }


    const p =
        permissions();


    area.innerHTML = `

        <div class="admin-table-wrap">

            <table
                class="admin-table">

                <thead>

                    <tr>

                        <th>
                            Library
                        </th>

                        <th>
                            Seat
                        </th>

                        <th>
                            UID
                        </th>

                        <th>
                            Duration
                        </th>

                        <th>
                            Booked By
                        </th>

                        <th>
                            Status
                        </th>

                        ${p.cancel

            ?

            `
                            <th>
                                Action
                            </th>
                            `

            :

            ""
        }

                    </tr>

                </thead>


                <tbody>

                    ${active
            .map(
                booking => `

                                    <tr>

                                        <td>
                                            ${escapeHTML(
                    getLibraryName(
                        booking.libraryId
                    )
                )}
                                        </td>

                                        <td>
                                            S${booking.seatNumber}
                                        </td>

                                        <td>
                                            ${escapeHTML(
                    booking.uid
                )}
                                        </td>

                                        <td>
                                            ${booking.duration}
                                            hour(s)
                                        </td>

                                        <td>
                                            ${escapeHTML(
                    booking.bookedBy
                )}
                                        </td>

                                        <td>
                                            ${booking.checkedIn
                        ? "Checked In"
                        : "Pending"
                    }
                                        </td>

                                        ${p.cancel

                        ?

                        `

                                            <td>

                                                <button
                                                    class="
                                                    mini-btn
                                                    mini-danger
                                                    "
                                                    onclick="
                                                        staffCancelBooking(
                                                            '${booking.id}'
                                                        )">

                                                    Cancel

                                                </button>

                                            </td>

                                            `

                        :

                        ""
                    }

                                    </tr>

                                `
            )
            .join("")
        }

                </tbody>

            </table>

        </div>

    `;
}


/* ============================================================
   50. AUTOMATIC BOOKING SYSTEM
============================================================ */

setInterval(
    function () {

        const now =
            Date.now();


        let changed =
            false;


        bookings.forEach(
            booking => {

                /*
                   Check-in expiry
                */

                if (

                    booking.status ===
                    "active"

                    &&

                    !booking.checkedIn

                    &&

                    now >
                    booking.checkInDeadline

                ) {

                    booking.status =
                        "cancelled";


                    booking.cancelReason =
                        "Automatic cancellation: check-in time expired.";


                    booking.cancelledAt =
                        now;


                    notices.push({

                        id:
                            Date.now() +
                            Math.random(),

                        uid:
                            booking.uid,

                        message:

                            "Your booking for seat S" +
                            booking.seatNumber +

                            " was automatically cancelled because you did not check in within 10 minutes.",

                        time:
                            now,

                        read:
                            false

                    });


                    changed =
                        true;
                }


                /*
                   Booking end
                */

                if (

                    booking.status ===
                    "active"

                    &&

                    now >
                    booking.endAt

                ) {

                    booking.status =
                        "completed";


                    changed =
                        true;
                }

            }
        );


        if (changed) {

            saveAll();


            if (currentUser) {

                renderLibraries();

                renderMyBooking();

                renderNotices();


                if (selectedLibrary) {

                    renderSeats();
                }
            }
        }


        if (currentUser) {

            renderMyBooking();
        }

    },
    1000
);


/* ============================================================
   51. CLOSE MODAL ON BACKDROP
============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "modal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeModal();
        }

    }
);


/* ============================================================
   END OF APP.JS
============================================================ */