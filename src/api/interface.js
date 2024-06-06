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

const api = {
    user: {
        getUser: (id) => get(`/users/get_user/${id}`),
        getOrCreateUser: (userId, fullName, userData) => post(`/users/get_or_create_user`, { user_id: userId, full_name: fullName, ...userData }),
        countUsers: () => get(`/users/count_users`),
        updateBalance: (userId, amount) => patch(`/users/update_balance/${userId}`, { amount }),
        updateReferrals: (userId, referral) => patch(`/users/update_referrals/${userId}`, { referral }),
        updateAchievementsDone: (userId, achievement) => patch(`/users/update_achievements_done/${userId}`, { achievement })
    },
    betaGame: {
        getOrCreateUserBeta: (betaData) => post(`/betagame/get_or_create_user_beta`, betaData),
        selectUser: (userId) => get(`/betagame/select_user/${userId}`),
        updateRecord: (userId, record) => patch(`/betagame/update_record/${userId}`, { record }),
        incrementGamesCount: (userId) => patch(`/betagame/increment_games_count/${userId}`),
        incrementTransactions: (userId, amount) => patch(`/betagame/increment_transactions/${userId}`, { amount })
    }
};

export {
    api
};
