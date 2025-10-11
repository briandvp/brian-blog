import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ArticleComments() {
  return (
    <div id="comments" className="mt-16 border-t pt-10">
      <h2 className="text-2xl font-lora font-bold mb-8">Reader Interactions</h2>

      <div className="mb-10">
        <h3 className="text-xl font-lora font-bold mb-6">Comments</h3>

        <div className="space-y-8">
          <Comment
            name="Daniel"
            date="10 octubre 2020 at 01:52"
            content="Muchas gracias, he referenciado tu artículo para un trabajo de la universidad, saludos."
          >
            <Comment
              name="Brian Gamarra"
              date="11 octubre 2020 at 10:26"
              content="Gracias a ti por valorarlo, espero que ese trabajo salga de lujo. Si has dado lo mejor en lo que dependía de tí puedes estar tranquilo"
              isReply
            />
          </Comment>

          <Comment
            name="Gema"
            date="3 febrero 2021 at 10:34"
            content="Excelente!!"
          />

          <Comment
            name="jeremias"
            date="24 marzo 2021 at 18:45"
            content="Maravillosa lectura con la que me he topado, ahora toca aplicarlo y ser felz."
          />

          <Comment
            name="Toche"
            date="11 abril 2021 at 10:27"
            content="Hola! Buscando información sobre la dicotomía del control he llegado a tu artículo y me ha encantado. De hecho, te he incluido entre los blogs que sigo por RSS, porque me resulta muy interesante lo que escribes. Por eso me atrevo a hacerte una corrección: en algún momento alguien atribuyó de forma errónea a Marco Aurelio el texto Señor, concédeme serenidad y ese error se ha ido extendiendo por toda la Internet. En realidad se trata de la Plegaria de la Serenidad, de Reinhold Niebuhr. Un saludo!"
          >
            <Comment
              name="Brian Gamarra"
              date="19 abril 2021 at 09:13"
              content="Muchas gracias a ti por el aporte, como diría Waldo Emerson 'Toda persona es mejor que yo en algún sentido y en ese sentido puedo aprender de él' Me alegro que te haya gustado, Un saludo"
              isReply
            />
            <Comment
              name="MARTILLO"
              date="12 noviembre 2021 at 03:54"
              content="Exacto La plegaria de la Serenidad, también conocida como oración de la Serenidad, es el conocido comienzo de una oración atribuida al teólogo, filósofo y escritor estadounidense de origen alemán Reinhold Niebuhr"
              isReply
            />
          </Comment>

          <Comment
            name="Claudia Di Marcantonio"
            date="17 noviembre 2021 at 22:21"
            content="Qué buen artículo!"
          />

          <Comment
            name="Hector Cesar Gomez"
            date="29 enero 2022 at 02:47"
            content="Excelente!"
          />

          <Comment
            name="Delfi"
            date="17 mayo 2023 at 10:43"
            content="Me ha encantado el articulo de la dicotonomia del control. Me ayuda este articulo, a no sufrir por lo que no puedo cambiar y a luchar al máximo por lo que puedo cambiar. Desde que le este artículo, os sigo, porque para mí ha sido de infinita ayuda para los momentos difíciles en mi vida.vuestras palabras me dan mucha fuerza, para seguir adelante cuando estoy desanimada y a punto de abandonar la lucha. 1 millón de gracias por la publicación.."
          />
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-lora font-bold mb-6">Deja una respuesta</h3>

        <form className="space-y-6">
          <Textarea
            placeholder="Comentario *"
            className="w-full h-32 resize-none"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                placeholder="Nombre *"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Correo electrónico *"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <input
                type="url"
                placeholder="Web"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="save-info"
              className="h-4 w-4"
            />
            <label htmlFor="save-info" className="text-sm text-gray-600">
              Guarda mi nombre, correo electrónico y web en este navegador para la próxima vez que comente.
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="notifications"
              className="h-4 w-4"
            />
            <label htmlFor="notifications" className="text-sm text-gray-600">
              Avísame por correo electrónico si alguien responde a mi comentario.
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="newsletter"
              className="h-4 w-4"
            />
            <label htmlFor="newsletter" className="text-sm text-gray-600">
              Quiero unirme a la familia de brian-blog y recibir gratis el ebook con más de 150 citas estoicas
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="privacy"
              className="h-4 w-4"
              required
            />
            <label htmlFor="privacy" className="text-sm text-gray-600">
              Acepto la <a href="/politica-privacidad/" className="text-gold hover:underline">política de privacidad</a>
            </label>
          </div>

          <div className="text-sm text-gray-600 bg-gray-100 p-4 rounded-md">
            <h4 className="font-bold mb-2">Información sobre protección de datos</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Responsable: Pedro Vivar Nuñez</li>
              <li>Fin del tratamiento: Controlar el spam, gestión de comentarios</li>
              <li>Legitimación: Tu consentimiento</li>
              <li>Comunicación de los datos: No se comunicarán los datos a terceros salvo por obligación legal.</li>
              <li>Derechos: Acceso, rectificación, portabilidad, olvido.</li>
              <li>Contacto: <a href="mailto:web@diarioestoico.com" className="text-gold hover:underline">web@diarioestoico.com</a></li>
              <li>Información adicional: Más información en <a href="/politica-privacidad/" className="text-gold hover:underline">Política de privacidad</a></li>
            </ul>
          </div>

          <Button
            type="submit"
            className="bg-gold hover:bg-dark-gold text-white font-bold py-2 px-6 rounded-md"
          >
            Publicar comentario
          </Button>
        </form>
      </div>
    </div>
  );
}

type CommentProps = {
  name: string;
  date: string;
  content: string;
  isReply?: boolean;
  children?: React.ReactNode;
};

function Comment({ name, date, content, isReply = false, children }: CommentProps) {
  return (
    <div className={`${isReply ? 'ml-12 mt-4' : ''}`}>
      <div className="flex items-start space-x-4">
        <Avatar className="h-12 w-12 rounded-full border">
          <AvatarFallback className="bg-gray-200 text-gray-600">{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-semibold">{name}</span>
              <span className="text-sm text-gray-500">{date}</span>
            </div>
            <p className="text-gray-700">{content}</p>
          </div>
          <Button
            variant="ghost"
            className="text-gold mt-2 text-sm font-medium"
          >
            Responder
          </Button>
        </div>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}