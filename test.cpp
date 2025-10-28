#include <SFML/Graphics.hpp>

int main()
{
	   sf::RenderWindow window(sf::VideoMode(sf::Vector2u(1920, 1080)), "titles goes here");
	   sf::CircleShape shape(100.f);
	   shape.setFillColor(sf::Color::Green);

	   while(window.isOpen())
	   {
	   	   while(std::optional<sf::Event> event = window.pollEvent())
	   	   {
	   	   	   if(event->getIf<sf::Event::Closed>())
	   	   	   {
	   	   	   	   window.close();
	   	   	   }
	   	   }

	   	   window.clear();
	   	   window.draw(shape);
	   	   window.display();
	   }

	   return 0;
}
