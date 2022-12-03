class Faq < ApplicationRecord

    validates :question, presence: true, length: { minimum: 1 }, allow_blank: false
    validates :answer, presence: true, length: { minimum: 1 }, allow_blank: false

end
