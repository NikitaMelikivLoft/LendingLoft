const express = require('express')
const router = express.Router()
const admCntr = require('../controllers/admin')
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')


router.get('/', async (req, res, next) => {

  const skills = await admCntr.getSkills()
  if(!req.session.auth)
  {
    req.flash('login','Соединение истекло')
    
    return res.redirect('/login')
  }


  let infoSkills = req.flash('infoSkills');
  infoSkills = infoSkills?.length ? infoSkills : null;
  let infoImages = req.flash('infoImages');
  infoImages = infoImages?.length ? infoImages : null;
  res.render('pages/admin', { title: 'Admin page', skills, msgskill: infoSkills, msgfile: infoImages })
})

router.post('/skills', async (req, res, next) => {
  try {
    const result = await admCntr.updateSkills(req.body)
    req.flash('infoSkills', 'Данные установлены')
    res.redirect('/admin')
  }
  catch (err) {
    req.flash('infoSkills', err)
    res.redirect('/admin')
  }


})


const validation = (fields, files) => {
  if (files.photo.originalFilename === '' || files.photo.size === 0) {
    return { status: 'Не загружена картинка!', err: true }
  }
  if (!fields.name ) {
    return { status: 'Не указано описание картинки!', err: true }
  }
  if (!fields.price) {
    return { status: 'Не указанa цена!', err: true }
  }
  return { status: 'Ok', err: false }
}


router.post('/upload', async (req, res, next) => {
  let form = new formidable.IncomingForm()
  let upload = path.join('./public', 'assets', 'img', 'products')

  if (!fs.existsSync(upload)) {
    fs.mkdirSync(upload)
  }

  form.uploadDir = path.join(process.cwd(), upload)

  form.parse(req, function (err, fields, files) {

    if (err) {
      return next(err)
    }

    const valid = validation(fields, files)

    if (valid.err) {
      fs.unlinkSync(files.photo.filepath)
      req.flash("infoImages", valid.status)
      return res.redirect(`/admin`)
    }
    const fileName = path.join(upload, files.photo.originalFilename)

    fs.rename(files.photo.filepath, fileName, async function (err) {
      if (err) {
        console.error(err.message)
        req.flash('infoImages', 'Ошибка загрузки')
        res.redirect('/admin')
        return
      }

      let dir = path.join('./assets', 'img', 'products', files.photo.originalFilename)

      await admCntr.addProduct({
        src: dir,
        name: fields.name,
        price: fields.price
      })
      req.flash('infoImages', 'Успешно загружено')
      res.redirect('/admin')
    })
  })
})

module.exports = router
