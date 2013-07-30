clear; clf;
x = [0 1 10 20 50 100 200 500 1000 5000 10000];
ins = [0 660 964 469 864 6955 14460 34901 65909 322281 547662];
del = [0 271 272 277 320 1387 1870 5654 14254 75101 229148]
subplot(121), 
plot(x(1:6), ins(1:6), 'b', 'linewidth', 5), hold on, grid on;
plot(x(1:6), del(1:6), 'r', 'linewidth', 3);
legend('Registro', 'Borrado');
xlabel('Cantidad de peticiones simultaneas de registro/borrado');
ylabel('Tiempo empleado (ms)');
subplot(122),
plot(x, ins, 'b', 'linewidth', 5), hold on, grid on;
plot(x, del, 'r', 'linewidth', 3);
legend('Registro', 'Borrado');
hold off;

