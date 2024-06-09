const baseUrl = "http://127.0.0.1:8000/api";

function get(path) {
    return fetch(`${baseUrl}${path}`, {
        credentials: 'include'
    }).then(res => res.json()).then(res => {
        if (res.statusCode === 200) {
            return res;
        }
        console.log(res.message);
        throw new Error(res.message);
    });
}

function post(path, data) {
    return fetch(`${baseUrl}${path}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': "application/json"
        },
        credentials: 'include'
    }).then(res => res.json()).then(res => {
        if (res.statusCode === 200) {
            return res;
        }
        console.log(res.message);
        throw new Error(res.message);
    });
}

function patch(path, data) {
    return fetch(`${baseUrl}${path}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': "application/json"
        },
        credentials: 'include'
    }).then(res => res.json()).then(res => {
        if (res.statusCode === 200) {
            return res;
        }
        console.log(res.message);
        throw new Error(res.message);
    });
}

function del(path) {
    return fetch(`${baseUrl}${path}`, {
        method: "DELETE",
        credentials: 'include'
    }).then(res => res.json()).then(res => {
        if (res.statusCode === 200) {
            return res;
        }
        console.log(res.message);
        throw new Error(res.message);
    });
}

const api = {
    achievements: {
        getAll: () => get(`/achievements`)
    },
    users: {
        getTopFive: () => get(`/users/get_top_five`),
    },
    user: {
        getUser: (id) => get(`/users/get_user/${id}`),
        getReferralsInfo: (userId) => get(`/users/my_referrals_info/${userId}`),
        getAchievementsDone: (userId) => get(`/users/get_achievements_done/${userId}`),
        getOrCreateUser: (userId, fullName, userData) => post(`/users/get_or_create_user`, { user_id: userId, full_name: fullName, ...userData }),
        countUsers: () => get(`/users/count_users`),
        updateBalance: (userId, amount) => patch(`/users/update_balance/${userId}`, { amount }),
        updateReferrals: (userId, referral) => patch(`/users/update_referrals/${userId}`, { referral }),
        updateAchievementsDone: (userId, achievement) => patch(`/users/update_achievements_done/${userId}`, { achievement })
    },
    betaGame: {
        getOrCreateUserBeta: (betaData) => post(`/betagame/get_or_create_user_beta`, betaData),
        getUser: (userId) => get(`/betagame/select_user/${userId}`),
        updateRecord: (userId, record) => patch(`/betagame/update_record/${userId}`, { record }),
        incrementGamesCount: (userId) => patch(`/betagame/increment_games_count/${userId}`),
        incrementTransactions: (userId, amount) => patch(`/betagame/increment_transactions/${userId}`, { amount })
    },
    balls: {
        getOrCreateBalls: (ballsData) => post(`/balls/get_or_create_balls`, ballsData),
        getBalls: (userId) => get(`/balls/get_balls/${userId}`),
        updateDailyLogin: (userId, dailyLogin) => patch(`/balls/update_daily_login/${userId}`, { daily_login: dailyLogin }),
        updateDailyLoginHundred: (userId, dailyLoginHundred) => patch(`/balls/update_daily_login_hundred/${userId}`, { daily_login_hundred: dailyLoginHundred }),
        updateDailyLimit: (userId, decrement) => patch(`/balls/update_daily_limit/${userId}`, { decrement }),
        deleteBalls: (userId) => del(`/balls/delete_balls/${userId}`)
    }
};

export {
    api
};
