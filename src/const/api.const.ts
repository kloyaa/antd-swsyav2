export const API_BASE_URL =
  import.meta.env.VITE_ENV === 'development'
    ? import.meta.env.VITE_API_BASE_URL_LOCAL
    : import.meta.env.VITE_API_BASE_URL;

export const API = {
  // Authentication related
  login: `${API_BASE_URL}/api/auth/v1/login`,
  ecryptLogin: `${API_BASE_URL}/api/auth/v1/login/ecrypt`,
  ecryptedLogin: `${API_BASE_URL}/api/auth/v1/login/encrypted`,
  verifyToken: `${API_BASE_URL}/api/auth/v1/token/verify`,

  // User related
  users: `${API_BASE_URL}/api/clients/v1/profiles`,

  // Transactions related
  transactions: `${API_BASE_URL}/api/transaction/v1/all`,
  transactionData: `${API_BASE_URL}/api/transaction/v1/data`,
  myTransactionData: `${API_BASE_URL}/api/me/transaction/v1/data`,
  userTransactions: `${API_BASE_URL}/api/transaction/v1/client`,


  // Employee related
  updateUserStatus: `${API_BASE_URL}/api/employee/v1/profile-verification`,

  // Others
  activities: `${API_BASE_URL}/api/activity/v1/activities`,

  // Bet
  dailyResults: `${API_BASE_URL}/api/bet/v1/daily-result`,

};

export const API_GET_PROFILES = `${API_BASE_URL}/api/clients/v1/profiles`;

// Admin priveleges
export const API_VERIFY_PROFILE = `${API_BASE_URL}/api/employee/v1/profile-verification`;
export const API_GET_ALL_BETS = `${API_BASE_URL}/api/bet/v1/bets`;

export const API_CREATE_DAILY_RESULT = `${API_BASE_URL}/api/bet/v1/result`;
export const API_GET_DAILY_TOTAL = `${API_BASE_URL}/api/bet/v1/daily-total`;
export const API_DELETE_DAILY_RESULT = `${API_BASE_URL}/api/bet/v1/remove`;
