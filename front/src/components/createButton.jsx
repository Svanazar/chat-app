import React from 'react'

import styles from './createButton.module.css'

function CreateButton(props){
  const {isCreating, toggle} = props
  return (
    <div className={styles.button} onClick={toggle}>
      {isCreating ? 'x' : '+'}
    </div>
  )
}

export default CreateButton