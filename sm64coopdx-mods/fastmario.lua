-- name: The Fast Speed Mod
-- description: Created by \\#ec7731\\uuphoria2\\#dcdcdc\\\n\nThis mod makes the player faster and increased jump height

function mario_update(m)
    m.peakHeight = m.pos.y

    if m.action == ACT_WALKING then
        m.forwardVel = m.forwardVel + 75
    end
end

hook_event(HOOK_MARIO_UPDATE, mario_update)
