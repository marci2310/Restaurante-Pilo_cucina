import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, CakeSlice, Clock3, Instagram, MapPin, Menu, MessageCircle, Music2, Navigation, Phone, Play, ShoppingBag, Users, X } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/5581996799134";
const IFOOD_URL = "https://www.ifood.com.br/delivery/recife-pe/pilo-cucina-boa-viagem/8aed3370-fd84-4550-a884-e962b2f8e5e1?utm_medium=ReserveGoogle";
const ANOTA_URL = "https://pedido.anota.ai/loja/pilo-cucina?f=ms";
// Link oficial de reservas do Pilo Cucina no Get In.
const GETIN_URL = "https://reservation.getin.app/MP9rn91L";

type MenuItem = { name: string; description: string; price: string; tag?: string; pairing?: string; allergens?: string };
const menuData: Record<string, MenuItem[]> = {
  "Antipasti": [
    { name: "Caprese", description: "Mussarela de búfala, tomates, rúcula, manjericão e molho pesto genovês", price: "45", tag: "vegetariano", pairing: "Pinot Grigio delle Venezie", allergens: "Leite e oleaginosas" },
    { name: "Bruschetta", description: "Pão italiano, mozzarela fresca, tomates marinados, rúcula e pesto genovês", price: "39", pairing: "Pinot Grigio delle Venezie", allergens: "Glúten, leite e oleaginosas" },
    { name: "Focaccia di Brie e Parma", description: "Brie, parma e geleia de damasco, finalizada com nozes", price: "49", tag: "feito na casa", pairing: "Provence Calvet Rosé", allergens: "Glúten, leite e oleaginosas" },
    { name: "Burrata", description: "Tradicional italiana, tomates marinados e pesto genovês com focaccia", price: "64", tag: "vegetariano", pairing: "Chardonnay Frizzante", allergens: "Leite e glúten" },
    { name: "Fonduta di Gamberi", description: "Fondue de queijo Primadonna com camarões e pancetta, acompanha pão italiano", price: "65", pairing: "Chardonnay Frizzante", allergens: "Leite, glúten e crustáceos" },
    { name: "Carpaccio di Manzo", description: "Filé mignon com mix de mostardas, lascas de Grana Padano, finalizado com azeite", price: "58", pairing: "Chianti Classico", allergens: "Mostarda e leite" },
    { name: "Tartare di Mignon", description: "Filé cortado na ponta da faca, temperado com aioli de limão-siciliano, servido com pão ciabatta", price: "69", pairing: "Chianti Classico", allergens: "Glúten, ovo e mostarda" },
    { name: "Pane Pilo", description: "Pão artesanal italiano, recheado com filé mignon e fonduta de Grana Padano", price: "65", tag: "feito na casa", pairing: "Chianti Classico", allergens: "Glúten e leite" },
  ],
  "Insalate": [
    { name: "Prime Burguer Italy", description: "Blend de carnes nobres com Primadonna, servido com salada de folhas, vinagrete e nozes", price: "57", pairing: "Primitivo I Contadini", allergens: "Leite, glúten e oleaginosas" },
    { name: "Gamberi e Pera", description: "Camarões grelhados ao creme de queijo de cabra, mix de folhas orgânicas, pêra caramelizada com raspas de limão-siciliano", price: "65", pairing: "Chardonnay Frizzante", allergens: "Leite e crustáceos" },
  ],
  "Primi e Secondi": [
    { name: "Ravioli di Magro", description: "Recheado com ricota fresca e espinafre com molho de tomate e Grana Padano", price: "54", tag: "vegetariano", pairing: "Chianti Classico", allergens: "Glúten e leite" },
    { name: "Ravioli ai Funghi", description: "Recheado com cogumelos frescos e gouda, servido com manteiga de trufas", price: "64", pairing: "Chianti Classico", allergens: "Glúten e leite" },
    { name: "Rigatoni alla Bolognese", description: "Rigatone com ragù à bolonhesa clássico e queijo Grana Padano", price: "49", pairing: "Chianti Classico", allergens: "Glúten e leite" },
    { name: "Gnocchi ai Fonduta e Tartufo", description: "Nhoque de batata e ricota com fonduta de Grana Padano, creme de trufas, cogumelos frescos e presunto Parma DOP", price: "64", pairing: "Brunello di Montalcino", allergens: "Glúten e leite" },
    { name: "Linguine ai Gamberi", description: "Massa fresca salteada com camarões flambados ao pesto de pistache e creme de burrata", price: "78", pairing: "Chardonnay Frizzante", allergens: "Glúten, leite, oleaginosas e crustáceos" },
    { name: "Penne con Gamberi", description: "Penne gratinado com camarões ao creme de Primadonna", price: "79", pairing: "Chardonnay Frizzante", allergens: "Glúten, leite e crustáceos" },
    { name: "Lasagnetta di Vitello e Tartuffo Nero", description: "Massa fresca recheada com vitelo, cogumelos, mozzarella de búfala e trufas ao molho de fonduta de parmesão e vinho", price: "68", pairing: "Brunello di Montalcino", allergens: "Glúten e leite" },
    { name: "Penne con Filettino Primadonna", description: "Penne com filé mignon em cubos ao creme de Primadonna gratinado", price: "69", pairing: "Chianti Clássico Clemente VII", allergens: "Glúten e leite" },
    { name: "Lasagna di Melanzane", description: "Camadas de berinjela com mozzarella de búfala, molho pomodoro, finalizado com Grana Padano gratinado", price: "59", tag: "vegetariano", pairing: "Chianti Classico", allergens: "Leite e glúten" },
    { name: "Polpettone della Cucina", description: "Polpetone clássico recheado com búfala, gratinado com queijo Grana Padano e molho de tomates, servido com spaguetti fresco", price: "59", pairing: "Primitivo di Manduria", allergens: "Glúten e leite" },
    { name: "Tagliata di Manzo", description: "Flat Iron Angus, coberto com molho bernaise e dijon, servido com batata frita ao perfume de trufas", price: "79", pairing: "Primitivo di Manduria", allergens: "Ovo, leite e mostarda" },
    { name: "Medaglione in Crosta di Pistache", description: "Mignon em crosta de pistache, com redução de balsâmico trufado e nhoque com fonduta de queijo", price: "87", tag: "sugestão do chef", pairing: "Brunello di Montalcino", allergens: "Leite, glúten e pistache" },
    { name: "Filletto ai Funghi Secchi", description: "Mignon em crosta de Grana Padano, molho roti com funghi seco, servido com fettuccine fresco com fonduta de Grana Padano", price: "87", pairing: "Brunello di Montalcino", allergens: "Glúten e leite" },
    { name: "Filletto al Vino", description: "Mignon regado com redução de vinho tinto, servido com risotto de parmesão", price: "79", pairing: "Chianti Clássico Clemente VII", allergens: "Leite" },
    { name: "Lombo di Agnello", description: "Lombo de cordeiro ao molho de vinho e hortelã, acompanhado por risotto de gorgonzola e nozes", price: "79", pairing: "Brunello di Montalcino", allergens: "Leite e oleaginosas" },
    { name: "Risotto ai Gamberi Crocanti", description: "Risoto de Primadonna e rabanete com camarões empanados e azeite de ervas", price: "76", pairing: "Chardonnay Frizzante", allergens: "Leite, glúten e crustáceos" },
    { name: "Salmone Aioli", description: "Salmão grelhado com julienne de legumes no azeite de ervas", price: "75", pairing: "Pinot Grigio delle Venezie", allergens: "Peixe e ovo" },
    { name: "Pesce del Giorno", description: "Peixe grelhado em crosta de parmesão, com purê de abóbora e azeite de ervas", price: "77", pairing: "Pinot Grigio delle Venezie", allergens: "Peixe, leite e glúten" },
    { name: "Spaghetti Gran Formaggio", description: "Spaguete fresco preparado dentro do queijo Gran Formaggio com trufas. Opcional: camarões grelhados + R$ 79 ou filé mignon e molho roti + R$ 89", price: "69", tag: "especialidade da casa", pairing: "Chianti Clássico Clemente VII", allergens: "Glúten e leite" },
  ],
  "Pizzas": [
    { name: "Marguerita", description: "Massa artesanal de farinha italiana de longa fermentação, molho de tomates pelati, mussarela fior di latte, manjericão, parmesão e azeite", price: "57", tag: "vegetariano", pairing: "Chianti Classico", allergens: "Glúten e leite" },
    { name: "Pepperoni", description: "Massa artesanal, pepperoni, mozzarela fior di latte, cebola roxa caramelizada e azeite", price: "59", pairing: "Primitivo I Contadini", allergens: "Glúten e leite" },
    { name: "Gambereti", description: "Massa artesanal, camarões médios, mozzarela fior di latte, parmesão, queijo philadelphia, manjericão e azeite", price: "76", pairing: "Chardonnay Frizzante", allergens: "Glúten, leite e crustáceos" },
  ],
  "Burguer": [{ name: "Burguer Pilo", description: "Hambúrguer de blend de carnes nobres (200g), pão brioche, com Primadonna maçaricado, maionese de trufas e salada. Acompanha fritas", price: "55", pairing: "Primitivo I Contadini", allergens: "Glúten, leite e ovo" }],
  "Bambini": [{ name: "Filettino Pilo", description: "Escalopinho de filé, arroz ou spaguetti e fritas. Menu infantil válido até 12 anos", price: "45", tag: "até 12 anos", allergens: "Consulte nossa equipe" }],
  "Dolci": [
    { name: "Mousse al Cioccolato", description: "Mousse de chocolate belga crocante", price: "24", pairing: "Vinho do Porto Ruby", allergens: "Leite" },
    { name: "Tiramisu", description: "Camadas de biscoitos champanhe embebidos em café expresso com creme à base de queijo mascarpone e chocolate em pó", price: "29", pairing: "Vinho do Porto Tawny", allergens: "Glúten, leite e ovo" },
    { name: "Tortino al Dolce di Latte", description: "Petit gateau de doce de leite com sorvete de baunilha", price: "34", pairing: "Vinho do Porto 10 Anos", allergens: "Glúten, leite e ovo" },
    { name: "Budino al Pistacchio", description: "Pudim cremoso de pistache", price: "35", pairing: "Vinho do Porto Tawny", allergens: "Leite e pistache" },
  ],
  "Bibite e Drinks": [
    { name: "Água Mineral", description: "Água mineral", price: "9" }, { name: "Água Tônica", description: "Água tônica", price: "11" }, { name: "Água Italiana San Pellegrino 505ml", description: "Água italiana San Pellegrino · 505ml", price: "32" }, { name: "Água de Coco", description: "Água de coco", price: "15" }, { name: "Refrigerante", description: "Refrigerante", price: "10" }, { name: "Suco de Fruta", description: "Suco de fruta", price: "14" }, { name: "Suco Especial", description: "Suco especial da casa", price: "19" }, { name: "Suco de Uva Integral", description: "Suco de uva integral", price: "17" }, { name: "Energético", description: "Energético", price: "19" }, { name: "Soda Italiana", description: "Soda italiana", price: "18" }, { name: "Expresso", description: "Café expresso", price: "9" }, { name: "Cappuccino", description: "Cappuccino", price: "12" }, { name: "Chá", description: "Chá", price: "9" }, { name: "Long Neck", description: "Cerveja long neck", price: "16" }, { name: "Fitzgerald", description: "Cocktail Fitzgerald", price: "38" }, { name: "Moscow Mule", description: "Cocktail Moscow Mule", price: "29" }, { name: "Negroni", description: "Cocktail Negroni", price: "32" }, { name: "Aperol Spritz", description: "Cocktail Aperol Spritz", price: "32" }, { name: "Mojito", description: "Cocktail Mojito", price: "24" }, { name: "Boulevardier", description: "Cocktail Boulevardier", price: "27" }, { name: "Caipirinha", description: "Caipirinha", price: "19" }, { name: "Caipifruta Nacional", description: "Caipifruta com frutas nacionais", price: "25" }, { name: "Caipifruta Importada", description: "Caipifruta com frutas importadas", price: "29" }, { name: "Dry Martini", description: "Cocktail Dry Martini", price: "29" }, { name: "Gin & Tônica", description: "Gin & Tônica", price: "29" }, { name: "Gin Tônica Fruit", description: "Gin Tônica com frutas", price: "32" }, { name: "Coquetel de Frutas sem Álcool", description: "Coquetel de frutas sem álcool", price: "22", tag: "sem álcool" }, { name: "Vodka Importada", description: "Dose de destilado", price: "15", tag: "dose" }, { name: "Whisky 8 Anos", description: "Dose de destilado", price: "16", tag: "dose" }, { name: "Whisky 12 Anos", description: "Dose de destilado", price: "24", tag: "dose" }, { name: "Rum Importado", description: "Dose de destilado", price: "12", tag: "dose" }, { name: "Gin Importado", description: "Dose de destilado", price: "17", tag: "dose" }, { name: "Campari", description: "Dose de destilado", price: "12", tag: "dose" }, { name: "Tequila", description: "Dose de destilado", price: "16", tag: "dose" }, { name: "Cachaça Premium", description: "Dose de destilado", price: "15", tag: "dose" }, { name: "Licor Importado", description: "Digestivo", price: "24", tag: "digestivo" }, { name: "Vinho do Porto Ruby/Tawny", description: "Digestivo", price: "24", tag: "digestivo" }, { name: "Vinho do Porto 10 Anos", description: "Digestivo", price: "42", tag: "digestivo" },
  ],
  "Vini": [
    { name: "Millesimato Luvis", description: "Espumante · Itália", price: "155", tag: "espumante" }, { name: "Espumante Rosé", description: "Espumante rosé", price: "155", tag: "espumante" }, { name: "Lanson Black Label Brut", description: "Espumante · França", price: "699", tag: "champagne" },
    { name: "Isola Del Satiro Bianco", description: "Branco · Itália", price: "99" }, { name: "Chardonnay Frizzante", description: "Branco · Itália", price: "129" }, { name: "Pinot Grigio Delle Venezie", description: "Branco · Itália", price: "139" }, { name: "Grillo", description: "Branco · Itália", price: "149" }, { name: "Albert Bichot Chablis Domaine Long-Depaquit", description: "Branco · França", price: "519" }, { name: "Levity Verde", description: "Branco · Portugal", price: "119" }, { name: "Herdade São Miguel Colheita Selecionada Branco", description: "Branco · Portugal", price: "199" }, { name: "Ventisquero Reserva Sauvignon Blanc", description: "Branco · Chile", price: "149" }, { name: "Mario Gran Reserva Chardonnay", description: "Branco · Chile", price: "179" }, { name: "Callia Torrontés", description: "Branco · Argentina", price: "135" }, { name: "Chac Chac Sauvignon Blanc Las Perdices", description: "Branco · Argentina", price: "89" },
    { name: "Nerello Mascalese", description: "Rosé · Itália", price: "129" }, { name: "Provence Calvet", description: "Rosé · França", price: "289" },
    { name: "Ventuno Cabernet Sauvignon", description: "Tinto · Itália", price: "89" }, { name: "Isola Del Satiro Rosso", description: "Tinto · Itália", price: "99" }, { name: "Montepulciano D'Abruzzo", description: "Tinto · Itália", price: "139" }, { name: "Primitivo I Contadini", description: "Tinto · Itália", price: "149" }, { name: "Cabernet Sauvignon", description: "Tinto · Itália", price: "159" }, { name: "Chianti Vecchia Cantina DOCG", description: "Tinto · Itália", price: "159" }, { name: "Aglianico", description: "Tinto · Itália", price: "189" }, { name: "Dolcetto D'Alba", description: "Tinto · Itália", price: "199" }, { name: "Pinot Nero", description: "Tinto · Itália", price: "199" }, { name: "Chianti Clássico Clemente VII", description: "Tinto · Itália", price: "249", tag: "sommelier" }, { name: "Primitivo di Manduria", description: "Tinto · Itália", price: "275" }, { name: "Brunello di Montalcino", description: "Tinto · Itália", price: "680", tag: "rótulo especial" }, { name: "Barricado Tinto", description: "Tinto · Portugal", price: "99" }, { name: "Herdade São Miguel Colheita Selecionada Tinto", description: "Tinto · Portugal", price: "199" }, { name: "Ramón Bilbao Crianza", description: "Tinto · Espanha", price: "199" }, { name: "Ventisquero Clásico Carmenere", description: "Tinto · Chile", price: "109" }, { name: "Mario Reserva Cabernet Sauvignon", description: "Tinto · Chile", price: "135" }, { name: "Ventisquero Reserva Pinot Noir", description: "Tinto · Chile", price: "149" }, { name: "Mario Gran Reserva Carmenere", description: "Tinto · Chile", price: "179" }, { name: "Grey Cabernet Sauvignon", description: "Tinto · Chile", price: "299" }, { name: "Chac Chac Malbec Las Perdices", description: "Tinto · Argentina", price: "89" }, { name: "Cavic Malbec", description: "Tinto · Argentina", price: "89" }, { name: "Kadabra Malbec", description: "Tinto · Argentina", price: "98" }, { name: "Bodega Privada Malbec", description: "Tinto · Argentina", price: "119" }, { name: "Callia Cabernet Sauvignon", description: "Tinto · Argentina", price: "135" },
    { name: "Ventisquero Reserva Sauvignon Blanc", description: "Meia garrafa · Branco · Chile · 375ml", price: "79", tag: "375ml" }, { name: "Chianti Vecchia Cantina", description: "Meia garrafa · Tinto · Itália · 375ml", price: "79", tag: "375ml" }, { name: "Ventisquero Reserva Carmenere", description: "Meia garrafa · Tinto · Chile · 375ml", price: "79", tag: "375ml" },
  ],
};
const tabs = Object.keys(menuData);
const foodTabs = tabs.filter((tab) => tab !== "Vini");

export default function Home() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [navOpen, setNavOpen] = useState(false);
  const [reservaOpen, setReservaOpen] = useState(false);
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [vinhosExpanded, setVinhosExpanded] = useState(false);
  const [casaVisible, setCasaVisible] = useState(false);
  const [menuSectionVisible, setMenuSectionVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [menuCycle, setMenuCycle] = useState(0);
  const [menuVisible, setMenuVisible] = useState(true);
  const casaRef = useRef<HTMLElement | null>(null);
  const menuSectionRef = useRef<HTMLElement | null>(null);
  const revealRefs = useRef<HTMLElement[]>([]);
  const items = useMemo(() => menuData[activeTab], [activeTab]);
  const changeTab = (tab: string) => { if (tab === activeTab) return; setMenuVisible(false); window.setTimeout(() => { setActiveTab(tab); setMenuCycle((cycle) => cycle + 1); setMenuVisible(true); }, 220); };
  useEffect(() => { const observer = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (!entry.isIntersecting) return; if (entry.target === casaRef.current) setCasaVisible(true); if (entry.target === menuSectionRef.current) setMenuSectionVisible(true); }); }, { threshold: .14 }); revealRefs.current.forEach((element) => element && observer.observe(element)); return () => observer.disconnect(); }, []);
  const reveal = (element: HTMLElement | null) => { if (element && !revealRefs.current.includes(element)) revealRefs.current.push(element); };

  const scrollTo = (id: string) => {
    if (id === "menu") setMenuExpanded(true);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setNavOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#F7F4EE] text-[#2B2B2B]">
      <header className="absolute inset-x-0 top-0 z-30 text-[#F7F4EE]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <a href="#top" className="font-serif text-3xl tracking-[-.06em]">pilo<span className="text-[#C5A880]">.</span> <em className="ml-1 text-sm tracking-[.12em] not-italic">cucina</em></a>
          <nav className="hidden items-center gap-8 text-[11px] uppercase tracking-[.2em] text-white/75 md:flex">
            <button onClick={() => scrollTo("menu")}>Menu</button><button onClick={() => scrollTo("casa")}>A casa</button><button onClick={() => scrollTo("visite")}>Visite-nos</button>
            <button onClick={() => setReservaOpen(true)} className="border border-[#C5A880] px-5 py-3 text-[#C5A880] transition hover:bg-[#C5A880] hover:text-[#243224]">Reservar mesa</button>
          </nav>
          <button aria-label="Abrir menu" className="rounded-full border border-white/30 p-2 md:hidden" onClick={() => setNavOpen(true)}><Menu size={19} /></button>
        </div>
      </header>

      {navOpen && <div className="fixed inset-0 z-50 bg-[#243224] p-7 text-[#F7F4EE] md:hidden"><div className="flex items-center justify-between"><span className="font-serif text-3xl">pilo<span className="text-[#C5A880]">.</span></span><button onClick={() => setNavOpen(false)} aria-label="Fechar menu"><X /></button></div><div className="mt-24 flex flex-col gap-8 font-serif text-4xl"><button className="text-left" onClick={() => scrollTo("menu")}>Menu</button><button className="text-left" onClick={() => scrollTo("casa")}>A casa</button><button className="text-left" onClick={() => scrollTo("visite")}>Visite-nos</button><button clas
