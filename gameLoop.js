let gameLoop = (() => {
    const gameLoop = setInterval(() => {
        drawBackground();
        drawInvaders();
        moveInvaders();
        ship.Move();
        ship.Draw();
    },1000/60)
})();

gameLoop();