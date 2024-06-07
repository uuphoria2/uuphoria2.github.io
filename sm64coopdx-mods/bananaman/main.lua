-- name: Banana Man
-- description: funny joke mod\n\nBy \\#808080\\uuphori\\#ffa500\\a2\\#ffffff\\. Credits go to Tally Hall for banana man here: https://www.youtube.com/watch?v=yModCU1OVHY

-- actually play banana man (tally hall)
local audio = audio_stream_load("banana_man.mp3")

function on_level_init()
    audio_stream_set_looping(audio, true)
    audio_stream_play(audio, true, 1)
end

hook_event(HOOK_ON_LEVEL_INIT, on_level_init)

-- CREDITS GO TO TALLY HALL FOR BANANA MAN HERE: https://www.youtube.com/watch?v=yModCU1OVHY
