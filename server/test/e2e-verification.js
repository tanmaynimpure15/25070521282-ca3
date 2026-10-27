/**
 * CampusConnect End-to-End Automated Test Suite
 * Validates all student, organizer, and admin workflows against PostgreSQL and Express APIs.
 */

import { validateCollegeEmail } from '../utils/emailValidator.js';

const BASE_URL = 'http://localhost:5000/api';

let studentCookie = '';
let organizerCookie = '';
let adminCookie = '';

async function runTests() {
  console.log('====================================================');
  console.log('   CAMPUSCONNECT — END-TO-END VALIDATION SUITE      ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // ----------------------------------------------------
    // TEST 1: College Email Validation Rules
    // ----------------------------------------------------
    console.log('[1/10] Testing SIT Nagpur Email Validation...');
    const validEmails = [
      'aswin.binu.batch2024@sitnagpur.siu.edu',
      'tanmay.deshmukh.batch2023@sitnagpur.siu.edu',
      'priya.k.nair.batch2025@sitnagpur.siu.edu'
    ];
    for (const em of validEmails) {
      const res = validateCollegeEmail(em);
      assert(res.isValid === true, `Valid student batch email accepted: ${em}`);
    }

    const invalidEmails = [
      'random.student@gmail.com',
      'student@sitnagpur.siu.edu', // missing batch
      'aswin.binu.batch24@sitnagpur.siu.edu', // 2-digit batch instead of 4
      'aswin@othercollege.edu'
    ];
    for (const em of invalidEmails) {
      const res = validateCollegeEmail(em);
      assert(res.isValid === false, `Invalid student email rejected: ${em}`);
    }

    // ----------------------------------------------------
    // TEST 2: Public Events Listing & Visibility
    // ----------------------------------------------------
    console.log('\n[2/10] Testing Public Event Listings...');
    const publicEventsRes = await fetch(`${BASE_URL}/events`);
    const publicEventsData = await publicEventsRes.json();
    assert(publicEventsRes.ok, 'Public events API responded with 200 OK');
    assert(Array.isArray(publicEventsData.events), 'Events list is an array');
    assert(
      publicEventsData.events.every(e => e.status === 'approved'),
      'Only approved events appear in public listing'
    );

    // ----------------------------------------------------
    // TEST 3: Student Registration with Batch Email
    // ----------------------------------------------------
    console.log('\n[3/10] Testing Student Account Registration...');
    const randomSuffix = Math.floor(Math.random() * 9000) + 1000;
    const testStudentEmail = `test.student${randomSuffix}.batch2025@sitnagpur.siu.edu`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `Test Student ${randomSuffix}`,
        email: testStudentEmail,
        password: 'Password123!'
      })
    });
    const regData = await regRes.json();
    assert(regRes.status === 201, `New student registered successfully: ${testStudentEmail}`);
    assert(regData.user.role === 'student', 'New account strictly gets student role');
    assert(!regData.user.email_verified_at, 'New account starts unverified');
    assert(Boolean(regData.verificationToken), 'Verification security token generated');

    const regCookies = regRes.headers.get('set-cookie');
    if (regCookies) studentCookie = regCookies.split(';')[0];

    // ----------------------------------------------------
    // TEST 4: Email Verification Enforcement on Event Registration
    // ----------------------------------------------------
    console.log('\n[4/10] Testing Unverified Registration Rejection...');
    const targetEvent = publicEventsData.events[0];
    const unverifiedAttempt = await fetch(`${BASE_URL}/registrations/events/${targetEvent.id}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': studentCookie 
      }
    });
    assert(
      unverifiedAttempt.status === 403, 
      'Unverified student is blocked from registering (403 Forbidden)'
    );

    // ----------------------------------------------------
    // TEST 5: Verify Email Address with Token
    // ----------------------------------------------------
    console.log('\n[5/10] Testing Email Verification Token Consumption...');
    const verifyRes = await fetch(`${BASE_URL}/auth/verify-email?token=${regData.verificationToken}`);
    const verifyData = await verifyRes.json();
    assert(verifyRes.ok, 'Email verification endpoint returned 200 OK');

    // ----------------------------------------------------
    // TEST 6: Event Registration After Verification
    // ----------------------------------------------------
    console.log('\n[6/10] Testing Verified Event Registration...');
    // Re-login to refresh cookie/claims
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testStudentEmail, password: 'Password123!' })
    });
    const loginData = await loginRes.json();
    assert(Boolean(loginData.user.email_verified_at), 'Account verified timestamp present');
    studentCookie = loginRes.headers.get('set-cookie').split(';')[0];

    const registerAttempt = await fetch(`${BASE_URL}/registrations/events/${targetEvent.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': studentCookie }
    });
    const registerAttemptData = await registerAttempt.json();
    assert(registerAttempt.status === 201, `Student successfully registered for "${targetEvent.title}"`);

    // ----------------------------------------------------
    // TEST 7: Duplicate Registration Prevention
    // ----------------------------------------------------
    console.log('\n[7/10] Testing Duplicate Registration Prevention...');
    const dupAttempt = await fetch(`${BASE_URL}/registrations/events/${targetEvent.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': studentCookie }
    });
    assert(dupAttempt.status === 409, 'Duplicate registration rejected with 409 Conflict');

    // ----------------------------------------------------
    // TEST 8: Registration Cancellation & Seat Release
    // ----------------------------------------------------
    console.log('\n[8/10] Testing Registration Cancellation...');
    const myRegsRes = await fetch(`${BASE_URL}/registrations/my-registrations`, {
      headers: { 'Cookie': studentCookie }
    });
    const myRegsData = await myRegsRes.json();
    const createdReg = myRegsData.registrations.find(r => r.event_id === targetEvent.id);
    assert(Boolean(createdReg), 'Registration appears in student dashboard');

    const cancelRes = await fetch(`${BASE_URL}/registrations/${createdReg.registration_id}`, {
      method: 'DELETE',
      headers: { 'Cookie': studentCookie }
    });
    assert(cancelRes.ok, 'Student can cancel registration to release seat');

    // ----------------------------------------------------
    // TEST 9: Organizer Event Creation Workflow
    // ----------------------------------------------------
    console.log('\n[9/10] Testing Organizer Event Submission & Attendees View...');
    const orgLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'tanmay.deshmukh.batch2023@sitnagpur.siu.edu',
        password: 'Password123!'
      })
    });
    organizerCookie = orgLogin.headers.get('set-cookie').split(';')[0];

    const newEventRes = await fetch(`${BASE_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': organizerCookie },
      body: JSON.stringify({
        title: `Inter-Branch Webathon ${randomSuffix}`,
        description: 'Collaborative web development challenge for SIT Nagpur students.',
        category: 'Technical',
        venue: 'Computer Center 3',
        start_at: new Date(Date.now() + 86400000 * 7).toISOString(),
        end_at: new Date(Date.now() + 86400000 * 7 + 14400000).toISOString(),
        capacity: 45
      })
    });
    const newEventData = await newEventRes.json();
    assert(newEventRes.status === 201, 'Organizer successfully created event');
    assert(newEventData.event.status === 'pending', 'Organizer event starts in "pending" status');

    // Check attendee list access
    const attendeesRes = await fetch(`${BASE_URL}/registrations/events/1/attendees`, {
      headers: { 'Cookie': organizerCookie }
    });
    const attendeesData = await attendeesRes.json();
    assert(attendeesRes.ok, 'Organizer can retrieve attendee roster for their event');
    assert(Array.isArray(attendeesData.attendees), 'Attendee roster is valid list');

    // ----------------------------------------------------
    // TEST 10: Admin Event Moderation & Role Management
    // ----------------------------------------------------
    console.log('\n[10/10] Testing Admin Approval Queue & Role Management...');
    const adminLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin.office@sitnagpur.siu.edu',
        password: 'Password123!'
      })
    });
    adminCookie = adminLogin.headers.get('set-cookie').split(';')[0];

    // Approve the pending event
    const approveRes = await fetch(`${BASE_URL}/events/${newEventData.event.id}/review`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Cookie': adminCookie },
      body: JSON.stringify({ status: 'approved' })
    });
    assert(approveRes.ok, `Admin approved event ID ${newEventData.event.id}`);

    // Verify it now appears in public listings!
    const updatedPublic = await fetch(`${BASE_URL}/events`);
    const updatedPublicData = await updatedPublic.json();
    assert(
      updatedPublicData.events.some(e => e.id === newEventData.event.id),
      'Newly approved event immediately appears in public explore listings'
    );

    // List users
    const usersRes = await fetch(`${BASE_URL}/auth/users`, {
      headers: { 'Cookie': adminCookie }
    });
    const usersData = await usersRes.json();
    assert(usersRes.ok && usersData.users.length > 0, 'Admin can view all users directory');

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  }

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
