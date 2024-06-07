-- name: The Fast Speed Mod
-- description: This mod makes the player faster and increased jump height \n\nBy \\#808080\\uuphori\\#ffa500\\a2\\#ffffff\\.

function mario_update(m)
    m.peakHeight = m.pos.y

    if m.action == ACT_WALKING then
        m.forwardVel = m.forwardVel + 75
    end
end

hook_event(HOOK_MARIO_UPDATE, mario_update)
