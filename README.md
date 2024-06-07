# trifulca

battle:
    start battle mode
    switch to turn based
        draw cards, choose three
    return battle result

game:
    start placement mode
    switch to turn based
        light goes first
        if attacking
            -> battle
        if attacker won
            take tile
            move opponent back
        else defender moves opponent back
        defeated enemy is stunned
        new turn
    end game
    
    
click start button:
    remove start button
    -> game
    return game result
    add start button