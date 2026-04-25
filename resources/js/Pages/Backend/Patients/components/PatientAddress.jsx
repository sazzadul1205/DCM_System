// Pages/Backend/Patients/components/PatientAddress.jsx

import FormField from '@/Components/FormField';
import { useMemo } from 'react';
import { FaMapMarkerAlt, FaCity, FaBuilding, FaMailBulk, FaHome } from 'react-icons/fa';

// Complete Bangladesh location data
const locationData = {
  Dhaka: {
    districts: [
      { value: 'Dhaka', label: 'Dhaka' },
      { value: 'Gazipur', label: 'Gazipur' },
      { value: 'Narayanganj', label: 'Narayanganj' },
      { value: 'Tangail', label: 'Tangail' },
      { value: 'Kishoreganj', label: 'Kishoreganj' },
      { value: 'Manikganj', label: 'Manikganj' },
      { value: 'Munshiganj', label: 'Munshiganj' },
      { value: 'Narsingdi', label: 'Narsingdi' },
      { value: 'Gopalganj', label: 'Gopalganj' },
      { value: 'Shariatpur', label: 'Shariatpur' },
      { value: 'Madaripur', label: 'Madaripur' },
      { value: 'Rajbari', label: 'Rajbari' },
      { value: 'Faridpur', label: 'Faridpur' },
    ],
    policeStations: {
      'Dhaka': [
        { value: 'Dhanmondi', label: 'Dhanmondi' },
        { value: 'Gulshan', label: 'Gulshan' },
        { value: 'Banani', label: 'Banani' },
        { value: 'Uttara', label: 'Uttara' },
        { value: 'Mirpur', label: 'Mirpur' },
        { value: 'Mohammadpur', label: 'Mohammadpur' },
        { value: 'Shahbag', label: 'Shahbag' },
        { value: 'Ramna', label: 'Ramna' },
        { value: 'Motijheel', label: 'Motijheel' },
        { value: 'Paltan', label: 'Paltan' },
        { value: 'Sutrapur', label: 'Sutrapur' },
        { value: 'Lalbagh', label: 'Lalbagh' },
        { value: 'Khilgaon', label: 'Khilgaon' },
        { value: 'Shampur', label: 'Shampur' },
        { value: 'Jatrabari', label: 'Jatrabari' },
        { value: 'Demra', label: 'Demra' },
        { value: 'Sabujbagh', label: 'Sabujbagh' },
        { value: 'Kafrul', label: 'Kafrul' },
        { value: 'Tejgaon', label: 'Tejgaon' },
        { value: 'Cantonment', label: 'Cantonment' },
      ],
      'Gazipur': [
        { value: 'Gazipur Sadar', label: 'Gazipur Sadar' },
        { value: 'Tongi', label: 'Tongi' },
        { value: 'Kapasia', label: 'Kapasia' },
        { value: 'Kaliakair', label: 'Kaliakair' },
        { value: 'Sreepur', label: 'Sreepur' },
        { value: 'Kaliganj', label: 'Kaliganj' },
      ],
      'Narayanganj': [
        { value: 'Narayanganj Sadar', label: 'Narayanganj Sadar' },
        { value: 'Siddhirganj', label: 'Siddhirganj' },
        { value: 'Bandar', label: 'Bandar' },
        { value: 'Rupganj', label: 'Rupganj' },
        { value: 'Araihazar', label: 'Araihazar' },
        { value: 'Sonargaon', label: 'Sonargaon' },
      ],
      'Tangail': [
        { value: 'Tangail Sadar', label: 'Tangail Sadar' },
        { value: 'Kalihati', label: 'Kalihati' },
        { value: 'Ghatail', label: 'Ghatail' },
        { value: 'Basail', label: 'Basail' },
        { value: 'Madhupur', label: 'Madhupur' },
        { value: 'Mirzapur', label: 'Mirzapur' },
      ],
      'Kishoreganj': [
        { value: 'Kishoreganj Sadar', label: 'Kishoreganj Sadar' },
        { value: 'Bhairab', label: 'Bhairab' },
        { value: 'Kuliarchar', label: 'Kuliarchar' },
        { value: 'Hossainpur', label: 'Hossainpur' },
        { value: 'Karimganj', label: 'Karimganj' },
      ],
      'Manikganj': [
        { value: 'Manikganj Sadar', label: 'Manikganj Sadar' },
        { value: 'Saturia', label: 'Saturia' },
        { value: 'Shibalaya', label: 'Shibalaya' },
        { value: 'Ghior', label: 'Ghior' },
        { value: 'Singair', label: 'Singair' },
      ],
      'Munshiganj': [
        { value: 'Munshiganj Sadar', label: 'Munshiganj Sadar' },
        { value: 'Tongibari', label: 'Tongibari' },
        { value: 'Sirajdikhan', label: 'Sirajdikhan' },
        { value: 'Louhajang', label: 'Louhajang' },
        { value: 'Gazaria', label: 'Gazaria' },
      ],
      'Narsingdi': [
        { value: 'Narsingdi Sadar', label: 'Narsingdi Sadar' },
        { value: 'Palash', label: 'Palash' },
        { value: 'Shibpur', label: 'Shibpur' },
        { value: 'Raipura', label: 'Raipura' },
        { value: 'Belabo', label: 'Belabo' },
      ],
      'Gopalganj': [
        { value: 'Gopalganj Sadar', label: 'Gopalganj Sadar' },
        { value: 'Tungipara', label: 'Tungipara' },
        { value: 'Kotalipara', label: 'Kotalipara' },
        { value: 'Muksudpur', label: 'Muksudpur' },
        { value: 'Kashiani', label: 'Kashiani' },
      ],
      'Shariatpur': [
        { value: 'Shariatpur Sadar', label: 'Shariatpur Sadar' },
        { value: 'Naria', label: 'Naria' },
        { value: 'Zanjira', label: 'Zanjira' },
        { value: 'Bhedarganj', label: 'Bhedarganj' },
        { value: 'Damudya', label: 'Damudya' },
      ],
      'Madaripur': [
        { value: 'Madaripur Sadar', label: 'Madaripur Sadar' },
        { value: 'Shibchar', label: 'Shibchar' },
        { value: 'Rajoir', label: 'Rajoir' },
        { value: 'Kalkini', label: 'Kalkini' },
      ],
      'Rajbari': [
        { value: 'Rajbari Sadar', label: 'Rajbari Sadar' },
        { value: 'Goalanda', label: 'Goalanda' },
        { value: 'Pangsha', label: 'Pangsha' },
        { value: 'Baliakandi', label: 'Baliakandi' },
      ],
      'Faridpur': [
        { value: 'Faridpur Sadar', label: 'Faridpur Sadar' },
        { value: 'Boalmari', label: 'Boalmari' },
        { value: 'Alfadanga', label: 'Alfadanga' },
        { value: 'Madhukhali', label: 'Madhukhali' },
        { value: 'Bhanga', label: 'Bhanga' },
        { value: 'Nagarkanda', label: 'Nagarkanda' },
        { value: 'Charbhadrasan', label: 'Charbhadrasan' },
        { value: 'Saltha', label: 'Saltha' },
      ],
    }
  },
  Chittagong: {
    districts: [
      { value: 'Chittagong', label: 'Chittagong' },
      { value: "Cox's Bazar", label: "Cox's Bazar" },
      { value: 'Rangamati', label: 'Rangamati' },
      { value: 'Bandarban', label: 'Bandarban' },
      { value: 'Khagrachari', label: 'Khagrachari' },
      { value: 'Lakshmipur', label: 'Lakshmipur' },
      { value: 'Noakhali', label: 'Noakhali' },
      { value: 'Feni', label: 'Feni' },
      { value: 'Comilla', label: 'Comilla' },
      { value: 'Brahmanbaria', label: 'Brahmanbaria' },
      { value: 'Chandpur', label: 'Chandpur' },
    ],
    policeStations: {
      'Chittagong': [
        { value: 'Chandgaon', label: 'Chandgaon' },
        { value: 'Panchlaish', label: 'Panchlaish' },
        { value: 'Khulshi', label: 'Khulshi' },
        { value: 'Pahartali', label: 'Pahartali' },
        { value: 'Halishahar', label: 'Halishahar' },
        { value: 'Bandar', label: 'Bandar' },
        { value: 'Double Mooring', label: 'Double Mooring' },
        { value: 'Kotwali', label: 'Kotwali' },
        { value: 'Bakolia', label: 'Bakolia' },
        { value: 'Bayazid', label: 'Bayazid' },
      ],
      "Cox's Bazar": [
        { value: "Cox's Bazar Sadar", label: "Cox's Bazar Sadar" },
        { value: 'Ramu', label: 'Ramu' },
        { value: 'Ukhia', label: 'Ukhia' },
        { value: 'Teknaf', label: 'Teknaf' },
        { value: 'Chakaria', label: 'Chakaria' },
        { value: 'Pekua', label: 'Pekua' },
        { value: 'Kutubdia', label: 'Kutubdia' },
        { value: 'Maheshkhali', label: 'Maheshkhali' },
      ],
      'Rangamati': [
        { value: 'Rangamati Sadar', label: 'Rangamati Sadar' },
        { value: 'Kaptai', label: 'Kaptai' },
        { value: 'Kawkhali', label: 'Kawkhali' },
        { value: 'Baghaichari', label: 'Baghaichari' },
        { value: 'Barkal', label: 'Barkal' },
        { value: 'Langadu', label: 'Langadu' },
        { value: 'Rajasthali', label: 'Rajasthali' },
        { value: 'Belaichari', label: 'Belaichari' },
        { value: 'Juraichari', label: 'Juraichari' },
        { value: 'Naniachar', label: 'Naniachar' },
      ],
      'Bandarban': [
        { value: 'Bandarban Sadar', label: 'Bandarban Sadar' },
        { value: 'Lama', label: 'Lama' },
        { value: 'Naikhongchari', label: 'Naikhongchari' },
        { value: 'Alikadam', label: 'Alikadam' },
        { value: 'Rowangchari', label: 'Rowangchari' },
        { value: 'Thanchi', label: 'Thanchi' },
        { value: 'Ruma', label: 'Ruma' },
      ],
      'Khagrachari': [
        { value: 'Khagrachari Sadar', label: 'Khagrachari Sadar' },
        { value: 'Dighinala', label: 'Dighinala' },
        { value: 'Panchari', label: 'Panchari' },
        { value: 'Lakshmichari', label: 'Lakshmichari' },
        { value: 'Mahalchari', label: 'Mahalchari' },
        { value: 'Matiranga', label: 'Matiranga' },
        { value: 'Guimara', label: 'Guimara' },
        { value: 'Ramgarh', label: 'Ramgarh' },
        { value: 'Manikchari', label: 'Manikchari' },
      ],
      'Lakshmipur': [
        { value: 'Lakshmipur Sadar', label: 'Lakshmipur Sadar' },
        { value: 'Raipur', label: 'Raipur' },
        { value: 'Ramganj', label: 'Ramganj' },
        { value: 'Ramgati', label: 'Ramgati' },
        { value: 'Kamalnagar', label: 'Kamalnagar' },
      ],
      'Noakhali': [
        { value: 'Noakhali Sadar', label: 'Noakhali Sadar' },
        { value: 'Begumganj', label: 'Begumganj' },
        { value: 'Senbagh', label: 'Senbagh' },
        { value: 'Chatkhil', label: 'Chatkhil' },
        { value: 'Sonaimuri', label: 'Sonaimuri' },
        { value: 'Hatiya', label: 'Hatiya' },
        { value: 'Kabirhat', label: 'Kabirhat' },
        { value: 'Subarnachar', label: 'Subarnachar' },
        { value: 'Companyganj', label: 'Companyganj' },
      ],
      'Feni': [
        { value: 'Feni Sadar', label: 'Feni Sadar' },
        { value: 'Chhagalnaiya', label: 'Chhagalnaiya' },
        { value: 'Daganbhuiyan', label: 'Daganbhuiyan' },
        { value: 'Sonagazi', label: 'Sonagazi' },
        { value: 'Parshuram', label: 'Parshuram' },
        { value: 'Fulgazi', label: 'Fulgazi' },
      ],
      'Comilla': [
        { value: 'Comilla Sadar', label: 'Comilla Sadar' },
        { value: 'Laksam', label: 'Laksam' },
        { value: 'Chandina', label: 'Chandina' },
        { value: 'Barura', label: 'Barura' },
        { value: 'Brahmanpara', label: 'Brahmanpara' },
        { value: 'Burichang', label: 'Burichang' },
        { value: 'Chauddagram', label: 'Chauddagram' },
        { value: 'Davidhar', label: 'Davidhar' },
        { value: 'Debidwar', label: 'Debidwar' },
        { value: 'Homna', label: 'Homna' },
        { value: 'Langalkot', label: 'Langalkot' },
        { value: 'Monohorgonj', label: 'Monohorgonj' },
        { value: 'Muradnagar', label: 'Muradnagar' },
        { value: 'Nangalkot', label: 'Nangalkot' },
        { value: 'Titas', label: 'Titas' },
      ],
      'Brahmanbaria': [
        { value: 'Brahmanbaria Sadar', label: 'Brahmanbaria Sadar' },
        { value: 'Ashuganj', label: 'Ashuganj' },
        { value: 'Nasirnagar', label: 'Nasirnagar' },
        { value: 'Nabinagar', label: 'Nabinagar' },
        { value: 'Sarail', label: 'Sarail' },
        { value: 'Kasba', label: 'Kasba' },
        { value: 'Akhaura', label: 'Akhaura' },
        { value: 'Bancharampur', label: 'Bancharampur' },
        { value: 'Bijoynagar', label: 'Bijoynagar' },
      ],
      'Chandpur': [
        { value: 'Chandpur Sadar', label: 'Chandpur Sadar' },
        { value: 'Faridganj', label: 'Faridganj' },
        { value: 'Haimchar', label: 'Haimchar' },
        { value: 'Haziganj', label: 'Haziganj' },
        { value: 'Kachua', label: 'Kachua' },
        { value: 'Matlabpur', label: 'Matlabpur' },
        { value: 'Shahrasti', label: 'Shahrasti' },
      ],
    }
  },
  Rajshahi: {
    districts: [
      { value: 'Rajshahi', label: 'Rajshahi' },
      { value: 'Chapainawabganj', label: 'Chapainawabganj' },
      { value: 'Naogaon', label: 'Naogaon' },
      { value: 'Natore', label: 'Natore' },
      { value: 'Pabna', label: 'Pabna' },
      { value: 'Sirajganj', label: 'Sirajganj' },
      { value: 'Bogra', label: 'Bogra' },
      { value: 'Joypurhat', label: 'Joypurhat' },
    ],
    policeStations: {
      'Rajshahi': [
        { value: 'Boalia', label: 'Boalia' },
        { value: 'Motihar', label: 'Motihar' },
        { value: 'Shah Makhdum', label: 'Shah Makhdum' },
        { value: 'Kazla', label: 'Kazla' },
        { value: 'Chandrima', label: 'Chandrima' },
      ],
      'Chapainawabganj': [
        { value: 'Chapainawabganj Sadar', label: 'Chapainawabganj Sadar' },
        { value: 'Shibganj', label: 'Shibganj' },
        { value: 'Nachole', label: 'Nachole' },
        { value: 'Bholahat', label: 'Bholahat' },
        { value: 'Gomastapur', label: 'Gomastapur' },
      ],
      'Naogaon': [
        { value: 'Naogaon Sadar', label: 'Naogaon Sadar' },
        { value: 'Mohadevpur', label: 'Mohadevpur' },
        { value: 'Manda', label: 'Manda' },
        { value: 'Niamatpur', label: 'Niamatpur' },
        { value: 'Raninagar', label: 'Raninagar' },
        { value: 'Atrai', label: 'Atrai' },
        { value: 'Porsha', label: 'Porsha' },
        { value: 'Sapahar', label: 'Sapahar' },
        { value: 'Patnitala', label: 'Patnitala' },
        { value: 'Dhamoirhat', label: 'Dhamoirhat' },
        { value: 'Badalgachhi', label: 'Badalgachhi' },
      ],
      'Natore': [
        { value: 'Natore Sadar', label: 'Natore Sadar' },
        { value: 'Baraigram', label: 'Baraigram' },
        { value: 'Bagatipara', label: 'Bagatipara' },
        { value: 'Lalpur', label: 'Lalpur' },
        { value: 'Singra', label: 'Singra' },
        { value: 'Naldanga', label: 'Naldanga' },
        { value: 'Gurudaspur', label: 'Gurudaspur' },
      ],
      'Pabna': [
        { value: 'Pabna Sadar', label: 'Pabna Sadar' },
        { value: 'Ishwardi', label: 'Ishwardi' },
        { value: 'Bera', label: 'Bera' },
        { value: 'Atgharia', label: 'Atgharia' },
        { value: 'Chatmohar', label: 'Chatmohar' },
        { value: 'Santhia', label: 'Santhia' },
        { value: 'Sujanagar', label: 'Sujanagar' },
        { value: 'Faridpur', label: 'Faridpur' },
        { value: 'Bhangura', label: 'Bhangura' },
      ],
      'Sirajganj': [
        { value: 'Sirajganj Sadar', label: 'Sirajganj Sadar' },
        { value: 'Kazipur', label: 'Kazipur' },
        { value: 'Belkuchi', label: 'Belkuchi' },
        { value: 'Chauhali', label: 'Chauhali' },
        { value: 'Shahjadpur', label: 'Shahjadpur' },
        { value: 'Tarash', label: 'Tarash' },
        { value: 'Ullapara', label: 'Ullapara' },
        { value: 'Rayganj', label: 'Rayganj' },
        { value: 'Kamarkhand', label: 'Kamarkhand' },
      ],
      'Bogra': [
        { value: 'Bogra Sadar', label: 'Bogra Sadar' },
        { value: 'Shibganj', label: 'Shibganj' },
        { value: 'Gabtali', label: 'Gabtali' },
        { value: 'Sonatala', label: 'Sonatala' },
        { value: 'Kahaloo', label: 'Kahaloo' },
        { value: 'Adamdighi', label: 'Adamdighi' },
        { value: 'Dhunat', label: 'Dhunat' },
        { value: 'Nandigram', label: 'Nandigram' },
        { value: 'Sherpur', label: 'Sherpur' },
        { value: 'Shariakandi', label: 'Shariakandi' },
      ],
      'Joypurhat': [
        { value: 'Joypurhat Sadar', label: 'Joypurhat Sadar' },
        { value: 'Khetlal', label: 'Khetlal' },
        { value: 'Akkelpur', label: 'Akkelpur' },
        { value: 'Kalai', label: 'Kalai' },
        { value: 'Panchbibi', label: 'Panchbibi' },
      ],
    }
  },
  Khulna: {
    districts: [
      { value: 'Khulna', label: 'Khulna' },
      { value: 'Bagerhat', label: 'Bagerhat' },
      { value: 'Satkhira', label: 'Satkhira' },
      { value: 'Jessore', label: 'Jessore' },
      { value: 'Jhenaidah', label: 'Jhenaidah' },
      { value: 'Magura', label: 'Magura' },
      { value: 'Narail', label: 'Narail' },
      { value: 'Kushtia', label: 'Kushtia' },
      { value: 'Chuadanga', label: 'Chuadanga' },
      { value: 'Meherpur', label: 'Meherpur' },
    ],
    policeStations: {
      'Khulna': [
        { value: 'Khulna Sadar', label: 'Khulna Sadar' },
        { value: 'Sonadanga', label: 'Sonadanga' },
        { value: 'Khalishpur', label: 'Khalishpur' },
        { value: 'Daulatpur', label: 'Daulatpur' },
        { value: 'Khan Jahan Ali', label: 'Khan Jahan Ali' },
        { value: 'Rupsha', label: 'Rupsha' },
        { value: 'Dighalia', label: 'Dighalia' },
        { value: 'Paikgachha', label: 'Paikgachha' },
      ],
      'Bagerhat': [
        { value: 'Bagerhat Sadar', label: 'Bagerhat Sadar' },
        { value: 'Mollahat', label: 'Mollahat' },
        { value: 'Fakirhat', label: 'Fakirhat' },
        { value: 'Kachua', label: 'Kachua' },
        { value: 'Rampal', label: 'Rampal' },
        { value: 'Mongla', label: 'Mongla' },
        { value: 'Morrelganj', label: 'Morrelganj' },
        { value: 'Sarankhola', label: 'Sarankhola' },
        { value: 'Chitalmari', label: 'Chitalmari' },
      ],
      'Satkhira': [
        { value: 'Satkhira Sadar', label: 'Satkhira Sadar' },
        { value: 'Assasuni', label: 'Assasuni' },
        { value: 'Debhata', label: 'Debhata' },
        { value: 'Tala', label: 'Tala' },
        { value: 'Kalaroa', label: 'Kalaroa' },
        { value: 'Kaliganj', label: 'Kaliganj' },
        { value: 'Shyamnagar', label: 'Shyamnagar' },
      ],
      'Jessore': [
        { value: 'Jessore Sadar', label: 'Jessore Sadar' },
        { value: 'Benapole', label: 'Benapole' },
        { value: 'Chowgacha', label: 'Chowgacha' },
        { value: 'Keshabpur', label: 'Keshabpur' },
        { value: 'Jhikargacha', label: 'Jhikargacha' },
        { value: 'Monirampur', label: 'Monirampur' },
        { value: 'Abhaynagar', label: 'Abhaynagar' },
        { value: 'Bagherpara', label: 'Bagherpara' },
      ],
      'Jhenaidah': [
        { value: 'Jhenaidah Sadar', label: 'Jhenaidah Sadar' },
        { value: 'Maheshpur', label: 'Maheshpur' },
        { value: 'Kaliganj', label: 'Kaliganj' },
        { value: 'Kotchandpur', label: 'Kotchandpur' },
        { value: 'Shailkupa', label: 'Shailkupa' },
        { value: 'Harinakunda', label: 'Harinakunda' },
      ],
      'Magura': [
        { value: 'Magura Sadar', label: 'Magura Sadar' },
        { value: 'Mohammadpur', label: 'Mohammadpur' },
        { value: 'Shalikha', label: 'Shalikha' },
        { value: 'Sreepur', label: 'Sreepur' },
      ],
      'Narail': [
        { value: 'Narail Sadar', label: 'Narail Sadar' },
        { value: 'Lohagara', label: 'Lohagara' },
        { value: 'Kalia', label: 'Kalia' },
      ],
      'Kushtia': [
        { value: 'Kushtia Sadar', label: 'Kushtia Sadar' },
        { value: 'Kumarkhali', label: 'Kumarkhali' },
        { value: 'Khoksa', label: 'Khoksa' },
        { value: 'Mirpur', label: 'Mirpur' },
        { value: 'Bheramara', label: 'Bheramara' },
        { value: 'Daulatpur', label: 'Daulatpur' },
      ],
      'Chuadanga': [
        { value: 'Chuadanga Sadar', label: 'Chuadanga Sadar' },
        { value: 'Alamdanga', label: 'Alamdanga' },
        { value: 'Damurhuda', label: 'Damurhuda' },
        { value: 'Jibannagar', label: 'Jibannagar' },
      ],
      'Meherpur': [
        { value: 'Meherpur Sadar', label: 'Meherpur Sadar' },
        { value: 'Mujibnagar', label: 'Mujibnagar' },
        { value: 'Gangni', label: 'Gangni' },
      ],
    }
  },
  Barisal: {
    districts: [
      { value: 'Barisal', label: 'Barisal' },
      { value: 'Barguna', label: 'Barguna' },
      { value: 'Bhola', label: 'Bhola' },
      { value: 'Jhalokati', label: 'Jhalokati' },
      { value: 'Patuakhali', label: 'Patuakhali' },
      { value: 'Pirojpur', label: 'Pirojpur' },
    ],
    policeStations: {
      'Barisal': [
        { value: 'Barisal Sadar', label: 'Barisal Sadar' },
        { value: 'Airport', label: 'Airport' },
        { value: 'Kawnia', label: 'Kawnia' },
        { value: 'Agailjhara', label: 'Agailjhara' },
        { value: 'Babuganj', label: 'Babuganj' },
        { value: 'Bakerganj', label: 'Bakerganj' },
        { value: 'Banaripara', label: 'Banaripara' },
        { value: 'Gournadi', label: 'Gournadi' },
        { value: 'Hijla', label: 'Hijla' },
        { value: 'Mehendiganj', label: 'Mehendiganj' },
        { value: 'Muladi', label: 'Muladi' },
        { value: 'Wazirpur', label: 'Wazirpur' },
      ],
      'Barguna': [
        { value: 'Barguna Sadar', label: 'Barguna Sadar' },
        { value: 'Amtali', label: 'Amtali' },
        { value: 'Betagi', label: 'Betagi' },
        { value: 'Bamna', label: 'Bamna' },
        { value: 'Patharghata', label: 'Patharghata' },
        { value: 'Taltali', label: 'Taltali' },
      ],
      'Bhola': [
        { value: 'Bhola Sadar', label: 'Bhola Sadar' },
        { value: 'Borhanuddin', label: 'Borhanuddin' },
        { value: 'Char Fasson', label: 'Char Fasson' },
        { value: 'Daulatkhan', label: 'Daulatkhan' },
        { value: 'Lalmohan', label: 'Lalmohan' },
        { value: 'Manpura', label: 'Manpura' },
        { value: 'Tazumuddin', label: 'Tazumuddin' },
      ],
      'Jhalokati': [
        { value: 'Jhalokati Sadar', label: 'Jhalokati Sadar' },
        { value: 'Kathalia', label: 'Kathalia' },
        { value: 'Nalchity', label: 'Nalchity' },
        { value: 'Rajapur', label: 'Rajapur' },
      ],
      'Patuakhali': [
        { value: 'Patuakhali Sadar', label: 'Patuakhali Sadar' },
        { value: 'Bauphal', label: 'Bauphal' },
        { value: 'Dashmina', label: 'Dashmina' },
        { value: 'Galachipa', label: 'Galachipa' },
        { value: 'Kalapara', label: 'Kalapara' },
        { value: 'Mirzaganj', label: 'Mirzaganj' },
        { value: 'Dumki', label: 'Dumki' },
        { value: 'Rangabali', label: 'Rangabali' },
      ],
      'Pirojpur': [
        { value: 'Pirojpur Sadar', label: 'Pirojpur Sadar' },
        { value: 'Bhandaria', label: 'Bhandaria' },
        { value: 'Kawkhali', label: 'Kawkhali' },
        { value: 'Mathbaria', label: 'Mathbaria' },
        { value: 'Nazirpur', label: 'Nazirpur' },
        { value: 'Nesarabad', label: 'Nesarabad' },
        { value: 'Indurkani', label: 'Indurkani' },
      ],
    }
  },
  Sylhet: {
    districts: [
      { value: 'Sylhet', label: 'Sylhet' },
      { value: 'Sunamganj', label: 'Sunamganj' },
      { value: 'Habiganj', label: 'Habiganj' },
      { value: 'Moulvibazar', label: 'Moulvibazar' },
    ],
    policeStations: {
      'Sylhet': [
        { value: 'Sylhet Sadar', label: 'Sylhet Sadar' },
        { value: 'South Surma', label: 'South Surma' },
        { value: 'Dakshin Surma', label: 'Dakshin Surma' },
        { value: 'Jaintiapur', label: 'Jaintiapur' },
        { value: 'Kanaighat', label: 'Kanaighat' },
        { value: 'Companiganj', label: 'Companiganj' },
        { value: 'Golapganj', label: 'Golapganj' },
        { value: 'Gowainghat', label: 'Gowainghat' },
        { value: 'Bishwanath', label: 'Bishwanath' },
        { value: 'Zakiganj', label: 'Zakiganj' },
        { value: 'Beanibazar', label: 'Beanibazar' },
        { value: 'Fenchuganj', label: 'Fenchuganj' },
        { value: 'Balaganj', label: 'Balaganj' },
      ],
      'Sunamganj': [
        { value: 'Sunamganj Sadar', label: 'Sunamganj Sadar' },
        { value: 'South Sunamganj', label: 'South Sunamganj' },
        { value: 'Bishwambarpur', label: 'Bishwambarpur' },
        { value: 'Chhatak', label: 'Chhatak' },
        { value: 'Derai', label: 'Derai' },
        { value: 'Dharamapasha', label: 'Dharamapasha' },
        { value: 'Dowarabazar', label: 'Dowarabazar' },
        { value: 'Jagannathpur', label: 'Jagannathpur' },
        { value: 'Jamalganj', label: 'Jamalganj' },
        { value: 'Sullah', label: 'Sullah' },
        { value: 'Tahirpur', label: 'Tahirpur' },
      ],
      'Habiganj': [
        { value: 'Habiganj Sadar', label: 'Habiganj Sadar' },
        { value: 'Ajmiriganj', label: 'Ajmiriganj' },
        { value: 'Baniachong', label: 'Baniachong' },
        { value: 'Bahubal', label: 'Bahubal' },
        { value: 'Chunarughat', label: 'Chunarughat' },
        { value: 'Lakhai', label: 'Lakhai' },
        { value: 'Madhabpur', label: 'Madhabpur' },
        { value: 'Nabiganj', label: 'Nabiganj' },
        { value: 'Shayestaganj', label: 'Shayestaganj' },
      ],
      'Moulvibazar': [
        { value: 'Moulvibazar Sadar', label: 'Moulvibazar Sadar' },
        { value: 'Barlekha', label: 'Barlekha' },
        { value: 'Juri', label: 'Juri' },
        { value: 'Kamalganj', label: 'Kamalganj' },
        { value: 'Kulaura', label: 'Kulaura' },
        { value: 'Rajnagar', label: 'Rajnagar' },
        { value: 'Sreemangal', label: 'Sreemangal' },
      ],
    }
  },
  Rangpur: {
    districts: [
      { value: 'Rangpur', label: 'Rangpur' },
      { value: 'Dinajpur', label: 'Dinajpur' },
      { value: 'Kurigram', label: 'Kurigram' },
      { value: 'Gaibandha', label: 'Gaibandha' },
      { value: 'Lalmonirhat', label: 'Lalmonirhat' },
      { value: 'Nilphamari', label: 'Nilphamari' },
      { value: 'Panchagarh', label: 'Panchagarh' },
      { value: 'Thakurgaon', label: 'Thakurgaon' },
    ],
    policeStations: {
      'Rangpur': [
        { value: 'Rangpur Sadar', label: 'Rangpur Sadar' },
        { value: 'Badarganj', label: 'Badarganj' },
        { value: 'Gangachara', label: 'Gangachara' },
        { value: 'Kaunia', label: 'Kaunia' },
        { value: 'Mithapukur', label: 'Mithapukur' },
        { value: 'Pirgacha', label: 'Pirgacha' },
        { value: 'Pirganj', label: 'Pirganj' },
        { value: 'Taraganj', label: 'Taraganj' },
      ],
      'Dinajpur': [
        { value: 'Dinajpur Sadar', label: 'Dinajpur Sadar' },
        { value: 'Birampur', label: 'Birampur' },
        { value: 'Birganj', label: 'Birganj' },
        { value: 'Biral', label: 'Biral' },
        { value: 'Bochaganj', label: 'Bochaganj' },
        { value: 'Chirirbandar', label: 'Chirirbandar' },
        { value: 'Phulbari', label: 'Phulbari' },
        { value: 'Ghoraghat', label: 'Ghoraghat' },
        { value: 'Hakimpur', label: 'Hakimpur' },
        { value: 'Kaharole', label: 'Kaharole' },
        { value: 'Khansama', label: 'Khansama' },
        { value: 'Nawabganj', label: 'Nawabganj' },
        { value: 'Parbatipur', label: 'Parbatipur' },
      ],
      'Kurigram': [
        { value: 'Kurigram Sadar', label: 'Kurigram Sadar' },
        { value: 'Bhurungamari', label: 'Bhurungamari' },
        { value: 'Char Rajibpur', label: 'Char Rajibpur' },
        { value: 'Chilmari', label: 'Chilmari' },
        { value: 'Phulbari', label: 'Phulbari' },
        { value: 'Nageshwari', label: 'Nageshwari' },
        { value: 'Rajarhat', label: 'Rajarhat' },
        { value: 'Raomari', label: 'Raomari' },
        { value: 'Ulipur', label: 'Ulipur' },
      ],
      'Gaibandha': [
        { value: 'Gaibandha Sadar', label: 'Gaibandha Sadar' },
        { value: 'Fulchhari', label: 'Fulchhari' },
        { value: 'Gobindaganj', label: 'Gobindaganj' },
        { value: 'Palashbari', label: 'Palashbari' },
        { value: 'Sadullapur', label: 'Sadullapur' },
        { value: 'Saghata', label: 'Saghata' },
        { value: 'Sundarganj', label: 'Sundarganj' },
      ],
      'Lalmonirhat': [
        { value: 'Lalmonirhat Sadar', label: 'Lalmonirhat Sadar' },
        { value: 'Aditmari', label: 'Aditmari' },
        { value: 'Hatibandha', label: 'Hatibandha' },
        { value: 'Kaliganj', label: 'Kaliganj' },
        { value: 'Patgram', label: 'Patgram' },
      ],
      'Nilphamari': [
        { value: 'Nilphamari Sadar', label: 'Nilphamari Sadar' },
        { value: 'Dimla', label: 'Dimla' },
        { value: 'Domar', label: 'Domar' },
        { value: 'Jaldhaka', label: 'Jaldhaka' },
        { value: 'Kishoreganj', label: 'Kishoreganj' },
        { value: 'Saidpur', label: 'Saidpur' },
      ],
      'Panchagarh': [
        { value: 'Panchagarh Sadar', label: 'Panchagarh Sadar' },
        { value: 'Atwari', label: 'Atwari' },
        { value: 'Boda', label: 'Boda' },
        { value: 'Debiganj', label: 'Debiganj' },
        { value: 'Tetulia', label: 'Tetulia' },
      ],
      'Thakurgaon': [
        { value: 'Thakurgaon Sadar', label: 'Thakurgaon Sadar' },
        { value: 'Baliadangi', label: 'Baliadangi' },
        { value: 'Haripur', label: 'Haripur' },
        { value: 'Pirganj', label: 'Pirganj' },
        { value: 'Ranisankail', label: 'Ranisankail' },
      ],
    }
  },
  Mymensingh: {
    districts: [
      { value: 'Mymensingh', label: 'Mymensingh' },
      { value: 'Jamalpur', label: 'Jamalpur' },
      { value: 'Netrokona', label: 'Netrokona' },
      { value: 'Sherpur', label: 'Sherpur' },
    ],
    policeStations: {
      'Mymensingh': [
        { value: 'Mymensingh Sadar', label: 'Mymensingh Sadar' },
        { value: 'Bhaluka', label: 'Bhaluka' },
        { value: 'Dhobaura', label: 'Dhobaura' },
        { value: 'Fulbaria', label: 'Fulbaria' },
        { value: 'Gaffargaon', label: 'Gaffargaon' },
        { value: 'Gauripur', label: 'Gauripur' },
        { value: 'Haluaghat', label: 'Haluaghat' },
        { value: 'Ishwarganj', label: 'Ishwarganj' },
        { value: 'Muktagachha', label: 'Muktagachha' },
        { value: 'Nandail', label: 'Nandail' },
        { value: 'Phulpur', label: 'Phulpur' },
        { value: 'Trishal', label: 'Trishal' },
        { value: 'Tarakanda', label: 'Tarakanda' },
      ],
      'Jamalpur': [
        { value: 'Jamalpur Sadar', label: 'Jamalpur Sadar' },
        { value: 'Baksiganj', label: 'Baksiganj' },
        { value: 'Dewanganj', label: 'Dewanganj' },
        { value: 'Islampur', label: 'Islampur' },
        { value: 'Madarganj', label: 'Madarganj' },
        { value: 'Melandaha', label: 'Melandaha' },
        { value: 'Sarishabari', label: 'Sarishabari' },
      ],
      'Netrokona': [
        { value: 'Netrokona Sadar', label: 'Netrokona Sadar' },
        { value: 'Atpara', label: 'Atpara' },
        { value: 'Barhatta', label: 'Barhatta' },
        { value: 'Durgapur', label: 'Durgapur' },
        { value: 'Kalmakanda', label: 'Kalmakanda' },
        { value: 'Kendua', label: 'Kendua' },
        { value: 'Khaliajuri', label: 'Khaliajuri' },
        { value: 'Madan', label: 'Madan' },
        { value: 'Mohanganj', label: 'Mohanganj' },
        { value: 'Purbadhala', label: 'Purbadhala' },
      ],
      'Sherpur': [
        { value: 'Sherpur Sadar', label: 'Sherpur Sadar' },
        { value: 'Jhenaigati', label: 'Jhenaigati' },
        { value: 'Nakla', label: 'Nakla' },
        { value: 'Nalitabari', label: 'Nalitabari' },
        { value: 'Sreebardi', label: 'Sreebardi' },
      ],
    }
  },
};

const divisions = [
  { value: 'Dhaka', label: 'Dhaka' },
  { value: 'Chittagong', label: 'Chittagong' },
  { value: 'Rajshahi', label: 'Rajshahi' },
  { value: 'Khulna', label: 'Khulna' },
  { value: 'Barisal', label: 'Barisal' },
  { value: 'Sylhet', label: 'Sylhet' },
  { value: 'Rangpur', label: 'Rangpur' },
  { value: 'Mymensingh', label: 'Mymensingh' },
];

export default function PatientAddress({ data, setData, errors }) {
  // Compute districts (NO state, NO effect)
  const availableDistricts = useMemo(() => {
    if (data.address_division && locationData[data.address_division]) {
      return locationData[data.address_division].districts;
    }
    return [];
  }, [data.address_division]);


  // Compute police stations (NO state, NO effect)
  const availablePoliceStations = useMemo(() => {
    if (
      data.address_division &&
      data.address_district &&
      locationData[data.address_division]?.policeStations?.[data.address_district]
    ) {
      return locationData[data.address_division].policeStations[data.address_district];
    }
    return [];
  }, [data.address_division, data.address_district]);



  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FaMapMarkerAlt className="text-green-600" />
          Address Information
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Division */}
          <FormField
            id="address_division"
            name="address_division"
            type="select"
            label="Division"
            value={data.address_division}
            onChange={(e) => setData('address_division', e.target.value)}
            error={errors.address_division}
            icon={FaMapMarkerAlt}
            options={divisions}
            placeholder="Select Division"
          />

          {/* District - Dynamic based on Division */}
          <FormField
            id="address_district"
            name="address_district"
            type="select"
            label="District"
            value={data.address_district}
            onChange={(e) => setData('address_district', e.target.value)}
            error={errors.address_district}
            icon={FaCity}
            options={availableDistricts}
            placeholder={data.address_division ? "Select District" : "Select Division first"}
            disabled={!data.address_division}
          />

          {/* Police Station / Thana - Dynamic based on District */}
          <FormField
            id="address_police_station"
            name="address_police_station"
            type="select"
            label="Police Station / Thana"
            value={data.address_police_station}
            onChange={(e) => setData('address_police_station', e.target.value)}
            error={errors.address_police_station}
            icon={FaBuilding}
            options={availablePoliceStations}
            placeholder={data.address_district ? "Select Police Station" : "Select District first"}
            disabled={!data.address_district}
          />

          {/* Postal Code */}
          <FormField
            id="address_postal_code"
            name="address_postal_code"
            type="text"
            label="Postal Code"
            value={data.address_postal_code}
            onChange={(e) => setData('address_postal_code', e.target.value)}
            error={errors.address_postal_code}
            icon={FaMailBulk}
            placeholder="Enter postal code"
          />

          {/* Address Details - Full width */}
          <div className="md:col-span-2">
            <FormField
              id="address_details"
              name="address_details"
              type="textarea"
              label="Address Details"
              value={data.address_details}
              onChange={(e) => setData('address_details', e.target.value)}
              error={errors.address_details}
              icon={FaHome}
              placeholder="House number, road, area, landmark..."
              rows={3}
              maxLength={255}  // Add this if address_details is VARCHAR(255)
            />
          </div>
        </div>
      </div>
    </div>
  );
}