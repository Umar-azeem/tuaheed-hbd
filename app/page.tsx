"use client"
import { useState, useRef, useEffect } from "react"
import { Volume2, VolumeX, Heart, Send } from "lucide-react"
import Confetti from "react-confetti"
import Cake from "@/components/cake"
export default function BirthdayPage() {
  const [isMuted, setIsMuted] = useState(false)
  const [wishMessage, setWishMessage] = useState("")
  const [senderName, setSenderName] = useState("")
  const audioRef = useRef<HTMLAudioElement>(null)
 const [showConfetti, setShowConfetti] = useState(false);
const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

useEffect(() => {
  setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  const handleResize = () => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  };
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);


  const triggerConfetti = () => {
  setShowConfetti(true);
  setTimeout(() => setShowConfetti(false), 5000); 
};


  const toggleAudio = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
      setIsMuted(!isMuted)
    }
  }

  const sendWishToWhatsApp = () => {
    if (!wishMessage.trim()) {
      alert("Please write a wish message!")
      return
    }

    const name = senderName.trim() || "A Friend"
    const message = `🎉 Birthday Wish for tuhaeed! 🎉\n\nFrom: ${name}\n\nMessage: ${wishMessage}`
    const encodedMessage = encodeURIComponent(message)
   
    setWishMessage("")
    setSenderName("")
  }

  {showConfetti && (
  <Confetti
    width={windowSize.width}
    height={windowSize.height}
    numberOfPieces={800}      
    gravity={0.3}             
    wind={0.01}               
    recycle={false}           
    initialVelocityX={10}
    initialVelocityY={20}
  />
)}


  const memories = [
    {
      image: "t1.png",
      caption: "Peaceful moments by the lake",
    },
    {
      image: "t2.png",
      caption: "Elegant and thoughtful",
    },
    {
      image: "t3.png",
      caption: "Formal and distinguished",
    },
    {
      image: "t4.png",
      caption: "Winter adventures",
    },
    {
      image: "t5.png",
      caption: "Stylish and confident",
    },
  ]

  const duas = [
     {
      arabic: " Happy Birthday Tuaheed",
      transliteration: "Turning 27 Years Young!",
      english: "Born: March 6, 1998",
    },{
      arabic: "",
      transliteration: "Celebrating a wonderful person with a kind heart and inspiring spirit. May your day be filled with joy, laughter, and countless blessings.",
    },
    {
      arabic: "اللهم أعطه عمراً طويلاً وصحة وعافية",
      transliteration: "Allahumma a'tihi 'umran taweelan wa sihhatan wa 'aafiyah",
      english: "O Allah, grant him a long life, good health, and well-being",
    },
    {
      arabic: "اللهم بارك له في عمره وعمله",
      transliteration: "Allahumma barik lahu fi 'umrihi wa 'amalihi",
      english: "O Allah, bless him in his life and his deeds",
    },
    {
      arabic: "اللهم احفظه من كل سوء وأدم عليه نعمك",
      transliteration: "Allahumma ihfazhu min kulli soo' wa adim 'alayhi ni'amak",
      english: "O Allah, protect him from all evil and continue Your blessings upon him",
    },
    {
      arabic: "اللهم اجعله من الصالحين وأسعده في الدنيا والآخرة",
      transliteration: "Allahumma ij'alhu min as-salihin wa as'idhu fi ad-dunya wa al-akhirah",
      english: "O Allah, make him among the righteous and grant him happiness in this life and the next",
    },
    
    
  ]

  const calculateAge = () => {
    const birthDate = new Date(1996, 10, 14)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return (
    <div className="max-h-screen md:min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-rose-50">
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} />}

      <audio
        ref={audioRef}
        src="/hbd.mp3"
        loop
        autoPlay
        muted={isMuted}
      />

      <button
        onClick={toggleAudio}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 bg-white/80 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg hover:bg-white transition-all"
        aria-label="Toggle music"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
        ) : (
          <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
        )}
      </button>

      <section className="flex flex-col h-1/3 items-center justify-center  py-22 sm:py-20 md:py-50  text-center relative overflow-hidden">
  <img
  src={"t10.png"}
  alt=""
  
    className="absolute inset-0 w-full h-auto object-cover"
  >
  </img>
<div></div>

  <div className="relative z-10 space-y-6 sm:space-y-8 max-w-2xl animate-fade-in hidden md:flex">
    <button
      onClick={triggerConfetti}
      className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-1 md:py-3 sm:py-2 md:px-6 sm:px-8 rounded-full text-base sm:text-lg shadow-lg hover:shadow-2xl transition-all transform hover:scale-110 animate-pulse-button"
    >
      <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
      Celebrate with Confetti!
    </button>
  </div>
</section>
      <section className="py-4 md:py-16 sm:py-20 px-4 bg-gradient-to-br from-pink-100 to-red-100">
    <Cake /></section>



      <section className="py-5 sm:py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="md:hidden flex justify-center  py-2 max-w-2xl animate-fade-in ">
    <button
      onClick={triggerConfetti}
      className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-2 md:py-4 sm:py-2 px-4  rounded-full text-base sm:text-sm shadow-lg hover:shadow-2xl transition-all transform hover:scale-110 animate-pulse-button"
    >
      <Heart className="w-5 h-4 sm:w-6 sm:h-6" />
      Celebrate 
    </button>
  </div>
          <h2 className="text-md md:text-5xl font-bold text-center text-red-900 mb-4 md:mb-16 text-balance">
            Cherished Memories
          </h2>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
  {memories.map((memory, index) => (
    <div
      key={index}
      className="group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-fade-in-up bg-black flex items-center justify-center"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <img
        src={memory.image || "/placeholder.svg"}
        alt={memory.caption}
        className="w-full h-auto  object-contain transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 via-red-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 sm:p-6">
        <p className="text-white font-semibold text-sm sm:text-lg text-balance">{memory.caption}</p>
      </div>
    </div>
  ))}
</div>


        </div>
      </section>

      <section className="py-4 md:py-16 sm:py-20 px-4 bg-gradient-to-br from-pink-100 to-red-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm md:text-4xl md:text-5xl font-bold text-center text-red-900 mb-2 sm:mb-4 text-balance">
            Duas for Long Life & Blessings
          </h2>
          <p className="text-center text-red-800 mb-4 md:mb-16 text-base sm:text-lg">
            May Allah bless you with a long, healthy, and prosperous life
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {duas.map((dua, index) => (
              <div
                key={index}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-red-500 hover:scale-105 transform animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-xl sm:text-2xl font-bold text-red-900 text-right leading-relaxed">{dua.arabic}</p>
                  <p className="text-xs sm:text-sm italic text-red-700">{dua.transliteration}</p>
                  <p className="text-sm sm:text-base text-red-800 leading-relaxed">{dua.english}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
<section className="py-5 sm:py-20 px-4 bg-white/50 backdrop-blur-sm">

</section>
   

      <section className="py-4 md:py-16 sm:py-20 px-4 bg-gradient-to-br from-pink-50 to-red-50">
        <div className="max-w-2xl mx-auto text-center space-y-4 sm:space-y-6">
          <h2 className="text-sm md:text-3xl  font-bold text-red-900 text-balance">
            Wishing You All the Best
          </h2>
          <p className="text-base sm:text-lg text-red-800 leading-relaxed">
            May every moment of your life be filled with happiness, success, and the love of those around you. Here's to
            another year of growth, adventure, and wonderful memories!
          </p>
          <p className="text-md md:text-2xl font-bold text-red-600">Happy Birthday, Tuaheed</p>

          <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-gradient-to-r from-pink-200 via-red-200 to-rose-200 rounded-xl sm:rounded-2xl border-2 border-red-500 shadow-lg animate-pulse">
            <p className="text-base sm:text-lg text-red-900 font-semibold">✨ With Love & Best Wishes From ✨</p>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-700 mt-2">Muhammad</p>
            <p className="text-sm sm:text-base text-red-800 mt-2">Celebrating this special day with you! 🎉</p>
          </div>
        </div>
      </section>
    </div>
  )
}
