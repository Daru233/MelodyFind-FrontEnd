const endpoints_heroku = {
    recommendations: 'https://melody-find.herokuapp.com/mf/v1/recommendation',
    playback: 'https://melody-find.herokuapp.com/mf/v1/start_playback',
    profile: 'https://melody-find.herokuapp.com/mf/v1/me',
    save: 'https://melody-find.herokuapp.com/mf/v1/save_track',
    default: 'http://192.168.0.4:5000/',
    exchange: '/exchange'
}

const endpoints = {
    recommendations: 'http://192.168.0.4:5000/mf/v1/recommendation',
    playback: 'http://192.168.0.4:5000/mf/v1/start_playback',
    profile: 'http://192.168.0.4:5000/mf/v1/me',
    save: 'http://192.168.0.4:5000/mf/v1/save_track',
    playlist: 'http://192.168.0.4:5000/mf/v1/playlists',
    add_to_playlist: 'http://192.168.0.4:5000/mf/v1/add_to_playlists',
    default: 'http://192.168.0.4:5000/',
    exchange: '/exchange'
}

export { endpoints }