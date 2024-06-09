export const { first_name, last_name, username, id } = window.Telegram.WebApp.initDataUnsafe.user
                                                        ? window.Telegram.WebApp.initDataUnsafe.user 
                                                        : {first_name: undefined, last_name: undefined, username: undefined, id: undefined};
